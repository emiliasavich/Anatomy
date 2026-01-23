function toggleWIP() {
  const content = document.getElementById("wip_content");
  const button = document.querySelector(".wip_toggle");

  content.classList.toggle("hidden");

  button.textContent = content.classList.contains("hidden")
    ? "Show content"
    : "Hide content";
}
