document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("feedback-form");
    const textarea = document.getElementById("message");
    const status = document.getElementById("feedback-status");

    // Utility function to show status with fade
    function showStatus(message, color, duration) {
        status.style.color = color;
        status.textContent = message;

        // Fade in
        status.style.opacity = 1;

        // Only fade out if it's NOT "Processing..."
        if (message !== "Submission processing...") {
            setTimeout(() => {
                status.style.opacity = 0;
            }, duration);
        }
    }

    form.addEventListener("submit", async function(e) {
        e.preventDefault(); // prevent normal form submission

        // Immediately clear text and show "Processing..."
        const message = textarea.value;
        textarea.value = "";
        showStatus("Submission processing...", "#2b2b2b");

        const data = new FormData();
        data.append("message", message);

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbw9nb0gIl2-ZwVW_SKjTBrdUiSA9s3RiO19-foKY85Xeb4zjpo8XrlDS06VHqjjYaMfaA/exec", {
                method: "POST",
                body: data
            });

            if (response.ok) {
                showStatus("Submission successful! Thank you :)", "#ffb563", 3000);
            } else {
                showStatus("Submission failed. Please send an email letting us know this doesn't work.", "red", 5000);
            }
        } catch (err) {
            console.error(err);
            showStatus("Submission failed. Please send an email letting us know this doesn't work.", "red", 5000);
        }
    });
});
