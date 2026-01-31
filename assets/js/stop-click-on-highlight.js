document.addEventListener('mousedown', (e) => {
    mouseDownPos = { x: e.clientX, y: e.clientY };
});

document.addEventListener('click', (e) => isDrag(e));

function isDrag(e) {
    if (!mouseDownPos) return true;

    const dx = e.clientX - mouseDownPos.x;
    const dy = e.clientY - mouseDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If mouse moved more than 5px, consider it a drag, ignore click
    if (distance > 5) return true;

    return false;
}
