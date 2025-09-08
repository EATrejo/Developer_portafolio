// lightbox.js - Versión corregida
const imagenes = document.querySelectorAll(".img-galeria");
const contenedorLight = document.querySelector(".imagen-light");
const hamburger1 = document.querySelector(".hamburger");
const closeLight = document.querySelector(".close");

// Variable para la imagen del lightbox
let imagenesLight = null;

// Función para inicializar el lightbox
function inicializarLightbox() {
    // Crear dinámicamente la imagen para el lightbox
    imagenesLight = document.createElement("img");
    imagenesLight.classList.add("imagen-lightbox");
    contenedorLight.appendChild(imagenesLight);
    
    // Eliminar cualquier imagen no deseada que pueda existir
    const imagenesNoDeseadas = document.querySelectorAll('img.agregar-imagen');
    imagenesNoDeseadas.forEach(img => {
        img.remove();
    });
}

// Inicializar el lightbox cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarLightbox);
} else {
    inicializarLightbox();
}

// Configurar event listeners para las imágenes
if (imagenes.length > 0) {
    imagenes.forEach((imagen) => {
        imagen.addEventListener("click", () => {
            aparecerImagen(imagen.getAttribute("src"));
        });
    });
}

// Event listener para cerrar el lightbox
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
    if (imagenesLight) {
        imagenesLight.src = imagen;
        contenedorLight.classList.add("show");
        imagenesLight.classList.add("showImage");
        if (hamburger1) hamburger1.style.opacity = 0;
    }
};

// Función para cerrar el lightbox
function cerrarLightbox() {
    if (contenedorLight) contenedorLight.classList.remove("show");
    if (imagenesLight) imagenesLight.classList.remove("showImage");
    if (hamburger1) hamburger1.style.opacity = 1;
}

// Eliminar imagen no deseada si aparece
function eliminarImagenNoDeseada() {
    const imagenNoDeseada = document.querySelector('img.agregar-imagen[src="images/bliblioteca.jpg"]');
    if (imagenNoDeseada) {
        imagenNoDeseada.remove();
        console.log('Imagen no deseada eliminada');
    }
}

// Ejecutar al cargar y observar cambios
document.addEventListener('DOMContentLoaded', function() {
    eliminarImagenNoDeseada();
    
    // Observar cambios en el DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                eliminarImagenNoDeseada();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});

// También ejecutar después de que todos los scripts se carguen
window.addEventListener('load', eliminarImagenNoDeseada);