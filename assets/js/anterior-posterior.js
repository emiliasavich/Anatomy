document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.view-buttons').forEach(buttonContainer => {
    const buttons = buttonContainer.querySelectorAll('.view-btn');
    const imgContainer = buttonContainer.previousElementSibling; // get the image container just above

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
        const view = btn.dataset.view;

        // Toggle active button
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Only toggle images inside this image container
        const images = imgContainer.querySelectorAll('.img-anterior, .img-posterior');
        images.forEach(img => {
            if (img.classList.contains('img-' + view) && (!img.classList.contains('alt-text') || img.hasAttribute('show'))) {
            img.style.display = 'block';
            } else {
            img.style.display = 'none';
            }
        });

        //   // Reset hover opacity for proper hover effect
        //   imgContainer.querySelectorAll('.img-hover').forEach(hoverImg => hoverImg.style.opacity = 0);
        //   imgContainer.querySelectorAll('.img-default').forEach(defaultImg => defaultImg.style.opacity = 1);
        });
    });
    });
});
