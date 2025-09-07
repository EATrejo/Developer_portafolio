// Importaciones necesarias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Creación de la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:8000', 'https://tu-dominio.com'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Brevo
let brevoConfigured = false;
if (process.env.BREVO_API_KEY) {
    try {
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
        brevoConfigured = true;
        console.log('✅ Brevo configurado correctamente');
    } catch (error) {
        console.warn('⚠️  Error configurando Brevo:', error.message);
    }
} else {
    console.warn('⚠️  BREVO_API_KEY no encontrado en variables de entorno');
}

// Configuración de Nodemailer (fallback)
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    console.log('✅ Nodemailer configurado correctamente');
} else {
    console.warn('⚠️  Credenciales de Gmail no configuradas');
}

// Ruta de prueba
app.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Servidor funcionando correctamente',
        services: {
            brevo: brevoConfigured,
            nodemailer: transporter !== null
        }
    });
});

// Ruta principal para enviar correos
app.post('/enviar', async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;

        console.log('📩 Solicitud recibida:', { nombre, email, mensaje: mensaje.substring(0, 50) + '...' });

        // Validación básica
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos los campos son requeridos: nombre, email y mensaje' 
            });
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor ingresa un email válido' 
            });
        }

        const emailContent = {
            from: process.env.EMAIL_FROM || email,
            to: process.env.EMAIL_TO || 'alonsotrejo1970@hotmail.com',
            subject: `Nuevo mensaje de ${nombre} desde tu Portfolio`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                        .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
                        .footer { margin-top: 20px; padding: 10px; text-align: center; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Nuevo mensaje de contacto</h1>
                        </div>
                        <div class="content">
                            <p><strong>Nombre:</strong> ${nombre}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Mensaje:</strong></p>
                            <p>${mensaje.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="footer">
                            <p>Enviado desde el portfolio de Alonso Trejo</p>
                            <p>📧 ${new Date().toLocaleString('es-MX')}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                NUEVO MENSAJE DE CONTACTO
                ========================
                
                Nombre: ${nombre}
                Email: ${email}
                
                Mensaje:
                ${mensaje}
                
                ------------------------
                Enviado desde el portfolio de Alonso Trejo
                Fecha: ${new Date().toLocaleString('es-MX')}
            `
        };

        // Intentar con Brevo primero
        if (brevoConfigured) {
            try {
                const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
                sendSmtpEmail.sender = { 
                    name: nombre, 
                    email: emailContent.from
                };
                sendSmtpEmail.to = [{ 
                    email: emailContent.to,
                    name: 'Alonso Trejo'
                }];
                sendSmtpEmail.subject = emailContent.subject;
                sendSmtpEmail.htmlContent = emailContent.html;
                sendSmtpEmail.textContent = emailContent.text;

                const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
                const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
                
                console.log('✅ Correo enviado exitosamente via Brevo');
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'Mensaje enviado exitosamente. ¡Gracias por contactarme!',
                    service: 'brevo'
                });

            } catch (brevoError) {
                console.warn('⚠️  Error con Brevo:', brevoError.message);
                // Continuar con el fallback
            }
        }

        // Fallback a Nodemailer
        if (transporter) {
            try {
                await transporter.sendMail(emailContent);
                console.log('✅ Correo enviado exitosamente via Nodemailer');
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'Mensaje enviado exitosamente. ¡Gracias por contactarme!',
                    service: 'nodemailer'
                });
            } catch (nodemailerError) {
                console.error('❌ Error con Nodemailer:', nodemailerError.message);
            }
        }

        // Si ambos métodos fallan
        console.log('📋 Mensaje recibido (pero no enviado por email):', { nombre, email, mensaje });
        
        return res.status(200).json({ 
            success: true, 
            message: 'Mensaje recibido. Te contactaré pronto. ¡Gracias!',
            service: 'console',
            data: { nombre, email, mensaje: mensaje.substring(0, 100) + '...' }
        });

    } catch (error) {
        console.error('❌ Error general al procesar solicitud:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor. Por favor intenta nuevamente.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log('\n🚀 =================================');
    console.log('🚀 Servidor de formulario iniciado');
    console.log('🚀 =================================');
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('✅ Health check: http://localhost:' + PORT + '/health');
    console.log('📧 Endpoint: http://localhost:' + PORT + '/enviar');
    console.log('==================================\n');
});