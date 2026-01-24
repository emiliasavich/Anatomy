document.addEventListener("DOMContentLoaded", function() {
  const isMobile = () => window.innerWidth <= 768;
  let activePopups = [];

  // Position and style a popup, based on term and stack
  function positionPopup(term, popup) {
    let top, left;

    if (activePopups.length > 0) {
      // Place on top of previous popup
      const lastPopup = activePopups[activePopups.length - 1];
      top = lastPopup.top;             // same vertical position
      left = lastPopup.left;           // horizontally offset from last popup
    } else {
      const rect = term.getBoundingClientRect();
      top = rect.top + window.scrollY;
      left = rect.right + 4;           // small spacing
    }

    popup.style.position = "absolute";
    popup.style.top = top + "px";
    popup.style.left = left + "px";
    popup.style.bottom = "auto";
    popup.style.zIndex = 1000 + activePopups.length; // make topmost visible

    // Save positioning for stacking next popup
    activePopups.push({
      term,
      popup,
      overlay: document.getElementById(popup.id + "-overlay"),
      top,
      right: left + popup.offsetWidth,
      left: left
    });
  }

  function showPopup(term, popup, overlay) {
    // Mobile: hide all first
    // if (isMobile()) {
    //   document.querySelectorAll(".popup-overlay").forEach(p => p.classList.remove("active"));
    //   document.querySelectorAll(".popup-content").forEach(p => p.classList.remove("active"));
    //   activePopups = [];
    // }

    

    // Only add click handler if the popup wasn't already active
    if (!popup.classList.contains("active")) {
      popup.addEventListener("click", (e) => {
        e.stopPropagation();
        hideTopPopup();
      });

      overlay.addEventListener("click", (e) => {
        e.stopPropagation();
        hidePopups();
      });
    }

    overlay.classList.add("active");
    popup.classList.add("active");

    // Always position popup
    positionPopup(term, popup);
  }

  function hideTopPopup() {
    if (activePopups.length === 0) return;
    const top = activePopups.pop();
    top.popup.classList.remove("active");
    top.overlay.classList.remove("active");
  }

  function hidePopups() {
    activePopups.forEach(p => {
      p.popup.classList.remove("active");
      p.overlay.classList.remove("active");
    });
    activePopups = [];
    // alert('in hide popups');
  }

  // Bind click events to all terms
  document.querySelectorAll(".popup-term").forEach(term => {
    const popupId = term.dataset.popupId;
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById(popupId + '-overlay');
    if (!popup || !overlay) return; 

    term.addEventListener("click", function(e) {
      e.stopPropagation();
      showPopup(term, popup, overlay);
    });
  });

  // Clicking outside closes all
  document.addEventListener("click", hidePopups);

  // Handle window resize
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      activePopups.forEach(p => positionPopup(p.term, p.popup));
    } else {
      // Mobile: snap to bottom
      activePopups.forEach(p => {
        p.popup.style.position = "fixed";
        p.popup.style.bottom = "0";
        p.popup.style.left = "0";
        p.popup.style.top = "auto";
        p.popup.style.width = "100%";
        p.popup.style.maxWidth = "100%";
      });
    }
  });
});
