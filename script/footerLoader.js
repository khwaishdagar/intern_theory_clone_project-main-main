import footer from "../component/footer.js";

const mountFooter = () => {
  const container = document.getElementById("footer_container");
  if (container) {
    container.innerHTML = footer();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountFooter);
} else {
  mountFooter();
}

