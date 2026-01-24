document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".enlarge");
  containers.forEach(initImageEnlarger);
});

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
  const existingOverlay = document.querySelector(".big-image-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
    return;
  }

  const overlay = createOverlay();
  const stack = createImageStack(images);

  overlay.appendChild(stack);
  document.body.appendChild(overlay);

  // Close overlay on click or right-click
  overlay.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    overlay.remove();
  });
}

/** Create overlay container */
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("big-image-overlay");
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
    width: "500px",
    height: "500px",
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
  Object.assign(img.style, {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    transition: "opacity 0s",
    opacity: opacity
  });
  return img;
}

// Named function to toggle labeled/unlabeled for a set of images
function toggleLabeled(images) {
  images.forEach(img => {
    let src = img.getAttribute("src"); // get relative path
    if (src.includes("/labeled")) {
      img.setAttribute("src", src.replace("/labeled", "/unlabeled"));
    } else {
      img.setAttribute("src", src.replace("/unlabeled", "/labeled"));
    }
  });
}
