let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex - 1].style.display = "block";

    setTimeout(showSlides, 4000); // Cambia la imagen cada 4 segundos
}

function moveSlide(n) {
    slideIndex += n;
    if (slideIndex < 1) { slideIndex = slides.length; }
    if (slideIndex > slides.length) { slideIndex = 1; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex - 1].style.display = "block";
}

// Inicializa el slider
showSlides();

