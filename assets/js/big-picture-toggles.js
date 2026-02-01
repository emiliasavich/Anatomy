document.addEventListener("DOMContentLoaded", () => {
    // --- Toggle sections ---
    document.querySelectorAll(".content-toggle-box").forEach(box => {
    box.addEventListener("click", (e) => {
        if (isDrag(e)) return;
        const content = box.querySelector(".content-toggle-content");
        const icon = box.querySelector(".content-toggle-plus");

        if (content.style.display == "block") {
            // is open so need to close
            content.style.display = "none";
            icon.textContent = "+";

            // check if header is visible in viewport
            const header = box.querySelector(".content-toggle-header");
            const rect = header.getBoundingClientRect();
            // partially visible = ANY overlap with viewport
            const partiallyVisible =
                rect.bottom > 0 && rect.top < window.innerHeight;

            // only scroll if NOT partially visible
            if (!partiallyVisible) {
                slowScrollTo(header, 600);  // smoother scroll
            }
        } else {
            // is closed so need to open
            content.style.display = "block";
            icon.textContent = "-";
        }

        // content.style.display = content.style.display === "block" ? "none" : "block";
        // icon.textContent = icon.textContent === "+" ? "-" : "+";

    });
    });

    // --- Scroll to child when clicked inside description ---
    document.querySelectorAll(".child-jump").forEach(link => {
    link.addEventListener("click", e => {
        if (isDrag(e)) return;

        e.preventDefault();
        e.stopPropagation();

        const childId = link.dataset.child;

        const parentBox = link.closest(".content-toggle-box");
        const content = parentBox.querySelector(".content-toggle-content");
        const child = document.getElementById(childId);
        const icon = parentBox.querySelector(".content-toggle-plus");


        // Ensure parent section is open
        if (content.style.display != "block") {
            content.style.display = "block";
            
            // Toggle plus
            icon.textContent = icon.textContent === "+" ? "-" : "+";
        }


        // Smooth scroll to child section
        child.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    });
});

function slowScrollTo(element, duration = 600) {
    const targetY = element.getBoundingClientRect().bottom + window.scrollY;
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // ease-in-out curve (feels smoother than linear)
        const eased = 0.5 * (1 - Math.cos(Math.PI * progress));

        window.scrollTo(0, startY + diff * eased);

        if (elapsed < duration) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}
