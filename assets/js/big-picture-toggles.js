document.addEventListener("DOMContentLoaded", () => {
    // --- Toggle sections ---
    document.querySelectorAll(".content-toggle-header").forEach(header => {
    header.addEventListener("click", (e) => {
        if (isDrag(e)) return;
        const parentBox = header.closest(".content-toggle-box");
        const content = parentBox.querySelector(".content-toggle-content");
        const icon = header.querySelector(".content-toggle-plus");
        content.style.display = content.style.display === "block" ? "none" : "block";
        icon.textContent = icon.textContent === "+" ? "-" : "+";

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
