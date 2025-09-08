// lightbox.js - Versión completamente corregida
document.addEventListener('DOMContentLoaded', function() {
    // Eliminar cualquier imagen no deseada inmediatamente
    const eliminarImagenNoDeseada = function() {
        const imagenesNoDeseadas = document.querySelectorAll('img.agregar-imagen');
        imagenesNoDeseadas.forEach(img => {
            console.log('Eliminando imagen no deseada:', img.src);
            img.remove();
        });
        
        // También buscar por src por si acaso
        const todasLasImagenes = document.querySelectorAll('img');
        todasLasImagenes.forEach(img => {
            if (img.src.includes('bliblioteca.jpg')) {
                console.log('Eliminando imagen no deseada por src:', img.src);
                img.remove();
            }
        });
    };
    
    // Ejecutar inmediatamente y cada 100ms por si se carga después
    eliminarImagenNoDeseada();
    const interval = setInterval(eliminarImagenNoDeseada, 100);
    
    // Detener después de 5 segundos
    setTimeout(() => clearInterval(interval), 5000);
    
    // Configurar lightbox con código limpio
    const imagenes = document.querySelectorAll(".img-galeria");
    const contenedorLight = document.querySelector(".imagen-light");
    const hamburger1 = document.querySelector(".hamburger");
    const closeLight = document.querySelector(".close");
    
    // Crear imagen para lightbox
    const imagenesLight = document.createElement("img");
    imagenesLight.classList.add("imagen-lightbox");
    if (contenedorLight) {
        // Limpiar contenedor light primero
        contenedorLight.innerHTML = '';
        contenedorLight.appendChild(imagenesLight);
        contenedorLight.appendChild(closeLight.cloneNode(true));
    }
    
    // Event listeners para las imágenes de la galería
    imagenes.forEach((imagen) => {
        imagen.addEventListener("click", () => {
            aparecerImagen(imagen.getAttribute("src"));
        });
    });
    
    // Event listener para cerrar lightbox
    if (contenedorLight) {
        contenedorLight.addEventListener("click", (e) => {
            if (e.target !== imagenesLight) {
                cerrarLightbox();
            }
        });
    }
    
    // Event listener para el botón de cerrar
    if (closeLight) {
        closeLight.addEventListener("click", cerrarLightbox);
    }
    
    // Función para mostrar imagen en el lightbox
    const aparecerImagen = (imagen) => {
        imagenesLight.src = imagen;
        contenedorLight.classList.add("show");
        imagenesLight.classList.add("showImage");
        if (hamburger1) hamburger1.style.opacity = 0;
    };
    
    // Función para cerrar el lightbox
    function cerrarLightbox() {
        contenedorLight.classList.remove("show");
        imagenesLight.classList.remove("showImage");
        if (hamburger1) hamburger1.style.opacity = 1;
    }
});