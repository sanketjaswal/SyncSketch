export const toolHover = () => {
  document.querySelectorAll(".hover-tool").forEach((element) => {
    // Handle click events
    element.addEventListener("click", function () {
      const dropdown = document.getElementById("myDropdown");
      if (dropdown && dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    });

    // Handle mouseover events
    element.addEventListener("mouseover", function () {
      window.onmousemove = function (event) {
        const hoverNameElement = document.getElementsByClassName("hoverName")[0];
        if (hoverNameElement) {
          hoverNameElement.style.top = `${event.clientY - 40}px`;
          hoverNameElement.style.left = `${event.clientX - 30}px`;
        }
      };

      const hoverNameElement = document.getElementsByClassName("hoverName")[0];
      const hoverTextElement = document.getElementsByClassName("Hnamep")[0];
      if (hoverNameElement && hoverTextElement) {
        hoverNameElement.style.display = "flex";
        hoverTextElement.innerHTML = element.id;
      }
    });

    // Handle mouseleave events
    element.addEventListener("mouseleave", function () {
      const hoverNameElement = document.getElementsByClassName("hoverName")[0];
      if (hoverNameElement) {
        hoverNameElement.style.display = "none";
      }
    });
  });
};
