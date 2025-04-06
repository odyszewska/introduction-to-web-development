document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll('.galeria img');

    images.forEach(image => {
        image.addEventListener('click', () => {
            if (image.classList.contains('zoomed')) {
                image.classList.remove('zoomed');
            } else {
                images.forEach(img => img.classList.remove('zoomed')); // Usuwa powiększenie z innych obrazów
                image.classList.add('zoomed');
            }
        });
    });
});