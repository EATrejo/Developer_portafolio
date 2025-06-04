// Importaciones necesarias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk'); // Usaremos el SDK de Brevo
require('dotenv').config(); // Para cargar las variables de entorno desde .env

// Creación de la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializa Brevo con tu API Key
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

app.post('/enviar', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { email: process.env.EMAIL }; // Tu dirección de correo
    sendSmtpEmail.to = [{ email: process.env.EMAIL }]; // Asegúrate de enviar a tu dirección
    sendSmtpEmail.subject = `Nuevo mensaje de ${nombre}`;
    sendSmtpEmail.textContent = `Nombre: ${nombre}\nCorreo: ${email}\nMensaje: ${mensaje}`;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    apiInstance.sendTransacEmail(sendSmtpEmail).then((data) => {
        console.log('Correo enviado:', data);
        res.status(200).send({ message: 'Correo enviado exitosamente' });
    }).catch((error) => {
        console.error('Error al enviar el correo:', error);
        res.status(500).send({ message: 'Error al enviar el correo', error: error.message });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
