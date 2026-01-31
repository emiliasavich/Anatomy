document.addEventListener("DOMContentLoaded", () => addHoverToImage(document));

function addHoverToImage(container) {
    container.querySelectorAll('.hoverable-image').forEach(hoverableImage => {
        // hover functionality
        const image_containers = hoverableImage.children;
        const hover_classes = Array.from(image_containers).map(child => child.classList[0]);

        // Add hover event
        hoverableImage.addEventListener('mouseenter', () => {
            changeImageOnHover(hover_classes[1], image_containers);
        });

        // Reset to default when mouse leaves hoverable container
        hoverableImage.addEventListener('mouseleave', () => {
            changeImageOnHover(hover_classes[0], image_containers);
        });
    });
};
