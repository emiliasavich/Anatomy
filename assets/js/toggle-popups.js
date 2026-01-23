document.addEventListener("DOMContentLoaded", function() {
  const isMobile = () => window.innerWidth <= 768;
  let activePopups = [];

  function positionPopup(term, popup) {
    const rect = term.getBoundingClientRect();
    let top = rect.top + window.scrollY;

    // if (!isMobile() && activePopups.length > 0) {
    //   const lastPopup = activePopups[activePopups.length - 1];
    //   top = lastPopup.bottom + 8;
    // }

    popup.style.position = "absolute";
    popup.style.top = top + "px";
    popup.style.left = rect.right + 4 + "px";
    popup.style.bottom = "auto";

    return top + popup.offsetHeight;
  }

  function showPopup(term, popup, overlay) {
    // On mobile: hide all popups first
    if (isMobile()) {
      document.querySelectorAll(".popup-overlay").forEach(p => p.classList.remove("active"));
      document.querySelectorAll(".popup-content").forEach(p => p.classList.remove("active"));
    }

    overlay.classList.add("active");
    popup.classList.add("active");

    if (!isMobile()) {
      const bottom = positionPopup(term, popup);
      activePopups.push({ term, popup, overlay, bottom });
    } else { // no else bc mobile formats are handled entirely in _custom.scss
      // Mobile: bottom of screen
      // popup.style.position = "fixed ";
      // popup.style.bottom = "0";
      // popup.style.left = "0";
      // popup.style.top = "auto";
      // popup.style.width = "100%"
      // popup.style.maxWidth = "100%"
    }
  }

  function hidePopups() {
    document.querySelectorAll(".popup-overlay").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".popup-content").forEach(p => p.classList.remove("active"));
    activePopups = [];
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

  // Hide popups when clicking outside
  document.addEventListener("click", hidePopups);
//   window.addEventListener("resize", hidePopups);
  window.addEventListener("resize", () => {
    activePopups.forEach(p => {
      if (!isMobile()) {
        p.bottom = positionPopup(p.term, p.popup);
      } else {
        // mobile: set to bottom of screen
        p.popup.style.position = "absolute";
        p.popup.style.bottom = "0";
        p.popup.style.left = "0";
        p.popup.style.top = "auto";
      }
    });
  });

});
