document.addEventListener('DOMContentLoaded', () => {
    const sectionHeaders = document.querySelectorAll('.section-header');

    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isVisible = content.style.display === 'block';

            content.style.display = isVisible ? 'none' : 'block';
        });
    });
});
