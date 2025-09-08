const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu-navegacion");
//console.log(hamburger);
//console.log(menu);

hamburger.addEventListener("click", () => {
  menu.classList.toggle("spread");
});

window.addEventListener("click", (e) => {
  if (
    menu.classList.contains("spread") &&
    e.target != menu &&
    e.target != hamburger
  ) {
    menu.classList.toggle("spread");
  }
});

document.querySelectorAll('.social-icons a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Evita la acción por defecto del enlace
        const info = this.querySelector('.info');
        
        // Alternar la visibilidad de la información
        if (info.style.display === 'none' || info.style.display === '') {
            info.style.display = 'block'; // Mostrar la información
        } else {
            info.style.display = 'none'; // Ocultar la información
        }
    });
});
function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    document.execCommand('copy'); // Copia el texto al portapapeles
    document.body.removeChild(tempInput); // Elimina el input temporal
    alert('Copiado: ' + text); // Mensaje de confirmación (puedes quitarlo si no lo necesitas)
}



