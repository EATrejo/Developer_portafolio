const imagenes = document.querySelectorAll(".img-galeria");
const contenedorLight = document.querySelector(".imagen-light");
const hamburger1 = document.querySelector(".hamburger");
const closeLight = document.querySelector(".close");

// Crear dinámicamente la imagen para el lightbox
const imagenesLight = document.createElement("img");
imagenesLight.classList.add("imagen-lightbox");
contenedorLight.appendChild(imagenesLight);

imagenes.forEach((imagen) => {
  imagen.addEventListener("click", () => {
    aparecerImagen(imagen.getAttribute("src"));
  });
});

contenedorLight.addEventListener("click", (e) => {
  if (e.target !== imagenesLight) {
    cerrarLightbox();
  }
});

if (closeLight) {
  closeLight.addEventListener("click", cerrarLightbox);
}

const aparecerImagen = (imagen) => {
  imagenesLight.src = imagen;
  contenedorLight.classList.add("show");
  imagenesLight.classList.add("showImage");
  hamburger1.style.opacity = 0;
};

function cerrarLightbox() {
  contenedorLight.classList.remove("show");
  imagenesLight.classList.remove("showImage");
  hamburger1.style.opacity = 1;
}