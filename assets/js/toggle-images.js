document.querySelectorAll(".toggle-container").forEach(container => {
  const images = container.querySelectorAll("img");

  container.addEventListener("click", () => {
    toggleLabeled(images); // call the named function
  });

  // Right-click on container -> show/hide big overlay
  container.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // prevent default browser menu

    // Check if overlay exists
    let overlay = document.querySelector(".big-image-overlay");
    if (overlay) {
      overlay.remove(); // hide overlay if already open
      return;
    }

    // Create overlay
    overlay = document.createElement("div");
    overlay.classList.add("big-image-overlay");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 9999;
    overlay.style.cursor = "pointer";

    // Add right-click listener to overlay itself to close it
    overlay.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      setSameToggle(images, big_images);
      overlay.remove();
    });

    // Container for stacked images
    const stack = document.createElement("div");
    stack.style.position = "relative";
    stack.style.width = "500px";
    stack.style.height = "500px";
    stack.style.overflow = "hidden";
    stack.style.display = "flex";
    stack.style.alignItems = "center";
    stack.style.justifyContent = "center";

    // First image (bottom)
    const img1 = document.createElement("img");
    img1.src = images[0].getAttribute("src");
    img1.style.width = "100%";
    img1.style.height = "100%";
    img1.style.objectFit = "cover";
    img1.style.position = "absolute";
    // img1.style.scale = 1.2;
    // img1.style.top = 0;
    // img1.style.left = 0;
    img1.style.transition = "transform 0.3s ease";
    img1.style.opacity = "1";

    // Second image (top)
    const img2 = document.createElement("img");
    img2.src = images[1].getAttribute("src");
    img2.style.width = "100%";
    img2.style.height = "100%";
    img2.style.objectFit = "cover";
    img2.style.position = "absolute";
    // img2.style.scale = 1.2;
    // img2.style.top = 0;
    // img2.style.left = 0;
    img2.style.transition = "transform 0.3s ease";
    img2.style.opacity = "0"; // start hidden

    // Hover over top image -> toggle opacity
    img2.addEventListener("mouseenter", () => {
      img2.style.opacity = "1";
      img1.style.opacity = "0";
    });
    img2.addEventListener("mouseleave", () => {
      img2.style.opacity = "0";
      img1.style.opacity = "1";
    });

    const big_images = [img1, img2]

    img1.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent overlay from receiving the click
        toggleLabeled([big_images]);
    });

    img2.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent overlay from receiving the click
        toggleLabeled(big_images); // call the named function
    });

    overlay.addEventListener("click", () => {
        toggleLabeled(big_images); // call the named function
    });
    

    // Add stacked images to stack container
    stack.appendChild(img1);
    stack.appendChild(img2);

    // Add stack to overlay
    overlay.appendChild(stack);

    // Add overlay to document
    document.body.appendChild(overlay);
  });
});

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

function setSameToggle(images, big_images) {
  overlayIsLabeled = big_images[0].src.includes("/labeled");
  originalIsLabeled = images[0].src.includes("/labeled");

  if (originalIsLabeled != overlayIsLabeled) toggleLabeled(images);
}
