const EnlargeNoCrop = (() => {

  /** Initialize image enlargement for a container */
  function initImageEnlarger(container) {
    const images = container.querySelectorAll("img");
    const imageArea = container.querySelector('[class*="image-container"]') || container;

    // Click to toggle labeled images (existing functionality)
    imageArea.addEventListener("click", () => toggleLabeled(images));

    // Right-click to open overlay
    imageArea.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      toggleOverlay(images);
    });
  }

  /** Toggle the big image overlay */
  function toggleOverlay(images) {
    // Remove existing overlay if present
    const existingOverlay = document.querySelector(".big-image-overlay-no-crop");
    if (existingOverlay) {
      const big_images = existingOverlay.querySelectorAll("img");
      setSameToggle(images, big_images);
      existingOverlay.remove();
      return;
    }

    const overlay = createOverlay();
    const stack = createImageStack(images);

    overlay.appendChild(stack);
    document.body.appendChild(overlay);

    const big_images = overlay.querySelectorAll("img");

    // Close overlay on click or right-click
    overlay.addEventListener("click", (e) => {
      setSameToggle(images, big_images);
      overlay.remove();
    });
    overlay.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      setSameToggle(images, big_images);
      overlay.remove();
    });
  }

  /** Create overlay container */
  function createOverlay() {
    const overlay = document.createElement("div");
    overlay.classList.add("big-image-overlay-no-crop");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      cursor: "pointer"
    });
    return overlay;
  }

  /** Create stacked images for overlay */
  function createImageStack(images) {
    const activeImages = Array.from(images).filter(img =>
      window.getComputedStyle(img).display === "block"
    );

    const img1 = createOverlayImage(activeImages[0].src, 1);
    const img2 = createOverlayImage(activeImages[1]?.src, 0);

    // Hover to toggle top image visibility
    img2.addEventListener("mouseenter", () => {
      img2.style.opacity = "1";
      img1.style.opacity = "0";
    });
    img2.addEventListener("mouseleave", () => {
      img2.style.opacity = "0";
      img1.style.opacity = "1";
    });

    img1.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent overlay from receiving the click
      toggleLabeled([img1, img2]);
    });

    img2.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent overlay from receiving the click
      toggleLabeled([img1, img2]); // call the named function
    });

    const stack = document.createElement("div");
    Object.assign(stack.style, {
      position: "relative",
      width: "90vw",
      height: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    });

    stack.appendChild(img1);
    if (activeImages[1]) stack.appendChild(img2);

    return stack;
  }

  /** Create an individual overlay image element */
  function createOverlayImage(src, opacity = 1) {
    const img = document.createElement("img");
    img.src = src;
    img.style.position = "relative";  // remove absolute positioning
    img.style.opacity = opacity;
    img.style.transition = "opacity 0s";

    // Constrain image to viewport
    img.style.maxWidth = "90vw";
    img.style.maxHeight = "90vh";

    img.style.width = "auto";   // natural width
    img.style.height = "auto";  // natural height

    img.style.objectFit = "contain";

    return img;
  }

  return { init: initImageEnlarger };
})();

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".enlarge-no-crop")
    .forEach(EnlargeNoCrop.init);
});

