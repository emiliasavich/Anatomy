document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".enlarge");
  
  containers.forEach(container => {
    // Initialize standard click toggling on the small version
    const images = container.querySelectorAll("img");
    const imageArea = container.querySelector('[class*="image-container"]') || container;
    
    // Left click on original just toggles labeled/unlabeled
    imageArea.addEventListener("click", (e) => {
      if (isDrag(e)) return;
      e.stopPropagation();
      toggleLabeled(images);
    });

    // Right click opens the enlarged view
    imageArea.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      openEnlargedClone(container);
    });
  });
});

function openEnlargedClone(originalContainer) {
  // 1. Create the Dark Background Overlay
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
    zIndex: 9998,
    cursor: "pointer"
  });

  // 2. Clone the Wrapper
  const clone = originalContainer.cloneNode(true);
  
  // Style the Cloned Wrapper (The 500x500 box)
  Object.assign(clone.style, {
    width: "90vw",
    maxWidth: "600px",     // or 500px if you prefer fixed
    height: "90vh",
    maxHeight: "600px",
    // background: "white", // Assuming you want a bg for the wrapper
    position: "relative", // Changed from fixed (overlay handles centering)
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    padding: "10px",
    cursor: "default", // Don't close when clicking inside the white box
    marginBottom: "auto",
  });

  // 3. FIX: Force the internal image container to fill the space
  const cloneImgContainer = clone.querySelector('[class*="image-container"]') || clone.querySelector("img");
  if (cloneImgContainer) {
    Object.assign(cloneImgContainer.style, {
      maxWidth: "500px",
      maxHeight: "500px", // dedicate most space to image
      width: "85vw",
      height: "85vh",
      position: "relative",
      display: "block",
    });
  }

  // Update size of button bar
  const cloneButtonBar = clone.querySelector('[class*="button-bar"]');
  if (cloneButtonBar) {
    Object.assign(cloneButtonBar.style, {
      maxWidth: "500px",
      width: "85vw",
    });
  }

  // 4. update figure caption
  const cloneImages = clone.querySelectorAll("img");
  cloneImages.forEach(img =>
    Object.assign(img.style, {
      objectFit: "cover",
      margin: "0 auto",
    })
  );

  const figcaption = clone.querySelector(".figcaption") || clone.querySelector("figcaption");
  if (figcaption) {
    Object.assign(figcaption.style, {
      fontSize: "20px",
      color: "lightgray",
      maxWidth: "500px",
      width: "85vw",
      margin: "0 auto",
    });
  }

  // 5. RE-BIND INTERACTIVITY to the Clone
  // A. Hover Logic (for the stack effect) - delete hoverable divs and circles and add them
  cloneImgContainer.querySelectorAll('.hoverable-div').forEach(el => el.remove());
  clone.querySelectorAll('.hoverable-circle').forEach(el => el.remove());
  addHoverableDivs(cloneImgContainer);

  // B. Click Logic (Toggle Labeled/Unlabeled on the clone)
  if (cloneImgContainer) {
    cloneImgContainer.addEventListener("click", (e) => {
      if (isDrag(e)) return;
      e.stopPropagation(); // Don't bubble to overlay
      toggleLabeled(cloneImages);
    });
  }
  
  // 6. Assemble and Add to DOM
  overlay.appendChild(clone);
  document.body.appendChild(overlay);

  // 7. View Button Functionality
  addViewButtonFunctionality(clone)

  // 8. Close Logic & Sync
  const closeAndSync = (e) => {
    // Sync the state from the big clone back to the original small images
    const originalImages = originalContainer.querySelectorAll("img");
    
    // Check if the clone is currently labeled
    const cloneIsLabeled = cloneImages[0].src.includes("/labeled");
    const originalIsLabeled = originalImages[0].src.includes("/labeled");

    // If different, toggle the original
    if (cloneIsLabeled !== originalIsLabeled) {
      toggleLabeled(originalImages);
    }

    // Remove all active class labels
    originalContainer.querySelectorAll(".active.to-sync").forEach(el => el.classList.remove("active"));

    // Sync back active class labels
    const activeInClone = clone.querySelectorAll('.active[data-view]');
    activeInClone.forEach(cloneEl => {
        const view = cloneEl.dataset.view;
        const firstClass = cloneEl.classList[0];

        if (!firstClass) return;

        const selector = `.${firstClass}[data-view="${view}"]`;
        const originalEl = originalContainer.querySelector(selector);

        if (originalEl) {
            originalEl.classList.add('active');
        }
    });

    // Sync view circles
    if (activeInClone.length > 0 && activeInClone[0].dataset) {
      const active_view = activeInClone[0].dataset.view;
      const original_button_bar = originalContainer.querySelector('[class*="button-bar"]');
      if (original_button_bar) {
        changeHoverCircle(active_view, original_button_bar.children);
      } 
    }

    overlay.remove();
  };

  // Close on backdrop click
  overlay.addEventListener("click", (e) => {
    if (isDrag(e)) return;
    if (e.target === overlay) closeAndSync();
  });

  // Close on right click
  overlay.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    closeAndSync();
  });

  // ESC key escape
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeAndSync();
      document.removeEventListener("keydown", escHandler);
    }
  });
}

/** Utility: Toggle labeled/unlabeled for a NodeList of images */
function toggleLabeled(images) {
  images.forEach(img => {
    let src = img.getAttribute("src");
    if (src.includes("/labeled")) {
      img.setAttribute("src", src.replace("/labeled", "/unlabeled"));
    } else {
      img.setAttribute("src", src.replace("/unlabeled", "/labeled"));
    }
  });
}

// document.addEventListener("DOMContentLoaded", () => {
//   const containers = document.querySelectorAll(".enlarge");
//   // containers.forEach(initImageEnlarger);
//   containers.forEach(ctr => {
//     ctr.addEventListener('contextmenu', (e) => {
//       e.preventDefault();
      
//       // Clone the container
//       const clone = ctr.cloneNode(true);
      
//       // Style it
//       Object.assign(clone.style, {
//         width: "500px",
//         height: "500px",
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         zIndex: 9999
//       });
      
//       // Optional: click to remove
//       clone.addEventListener("click", () => clone.remove());
//       // console.log(stack);

      
//       document.body.appendChild(clone);
//     });
//   });
// });

// /** Initialize image enlargement for a container */
// function initImageEnlarger(container) {
//   const images = container.querySelectorAll("img");
//   const imageArea = container.querySelector('[class*="image-container"]') || container;

//   // Click to toggle labeled images (existing functionality)
//   imageArea.addEventListener("click", () => toggleLabeled(images));

//   // Right-click to open overlay
//   imageArea.addEventListener("contextmenu", (e) => {
//     e.preventDefault();
//     toggleOverlay(images);
//   });
// }

// /** Toggle the big image overlay */
// function toggleOverlay(images) {
//   // Remove existing overlay if present
//   const existingOverlay = document.querySelector(".big-image-overlay");
//   if (existingOverlay) {
//     const big_images = existingOverlay.querySelectorAll("img");
//     setSameToggle(images, big_images);
//     existingOverlay.remove();
//     return;
//   }

//   const overlay = createOverlay();
//   const stack = createImageStack(images);

//   overlay.appendChild(stack);
//   document.body.appendChild(overlay);

//   const big_images = overlay.querySelectorAll("img");

//   // Close overlay on click or right-click
//   overlay.addEventListener("click", (e) => {
//     setSameToggle(images, big_images);
//     overlay.remove();
//   });
//   overlay.addEventListener("contextmenu", (e) => {
//     e.preventDefault();
//     setSameToggle(images, big_images);
//     overlay.remove();
//   });
// }

// /** Create overlay container */
// function createOverlay() {
//   const overlay = document.createElement("div");
//   overlay.classList.add("big-image-overlay");
//   Object.assign(overlay.style, {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100vw",
//     height: "100vh",
//     background: "rgba(0,0,0,0.8)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 9999,
//     cursor: "pointer"
//   });
//   return overlay;
// }

// /** Create stacked images for overlay */
// function createImageStack(images) {
//   const activeImages = Array.from(images).filter(img =>
//     window.getComputedStyle(img).display === "block"
//   );

//   const img1 = createOverlayImage(activeImages[0].src, 1);
//   const img2 = createOverlayImage(activeImages[1]?.src, 0);

//   // Hover to toggle top image visibility
//   img2.addEventListener("mouseenter", () => {
//     img2.style.opacity = "1";
//     img1.style.opacity = "0";
//   });
//   img2.addEventListener("mouseleave", () => {
//     img2.style.opacity = "0";
//     img1.style.opacity = "1";
//   });

//   img1.addEventListener("click", (e) => {
//     e.stopPropagation(); // prevent overlay from receiving the click
//     toggleLabeled([img1, img2]);
//   });

//   img2.addEventListener("click", (e) => {
//     e.stopPropagation(); // prevent overlay from receiving the click
//     toggleLabeled([img1, img2]); // call the named function
//   });

//   const stack = document.createElement("div");
//   Object.assign(stack.style, {
//     position: "relative",
//     width: "500px",
//     height: "500px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   });

//   stack.appendChild(img1);
//   if (activeImages[1]) stack.appendChild(img2);

//   return stack;
// }

// /** Create an individual overlay image element */
// function createOverlayImage(src, opacity = 1) {
//   const img = document.createElement("img");
//   img.src = src;
//   Object.assign(img.style, {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     position: "absolute",
//     transition: "opacity 0s",
//     opacity: opacity
//   });
//   return img;
// }

// // Named function to toggle labeled/unlabeled for a set of images
// function toggleLabeled(images) {
//   images.forEach(img => {
//     let src = img.getAttribute("src"); // get relative path
//     if (src.includes("/labeled")) {
//       img.setAttribute("src", src.replace("/labeled", "/unlabeled"));
//     } else {
//       img.setAttribute("src", src.replace("/unlabeled", "/labeled"));
//     }
//   });
// }

// // Make changes to enlarged image propagate to small image
// function setSameToggle(images, big_images) {
//   overlayIsLabeled = big_images[0].src.includes("/labeled");
//   originalIsLabeled = images[0].src.includes("/labeled");

//   if (originalIsLabeled != overlayIsLabeled) toggleLabeled(images);
// }
