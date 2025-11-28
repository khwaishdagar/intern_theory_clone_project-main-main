import navBar from "../component/navBar.js";
import footer from "../component/footer.js";
import sideBar from "./m_sidebar2.js";
import { initUserProfile } from "./userProfileHandler.js";
import { applyGlobalNavigation } from "./navigation.js";

const defaultOptions = {
  navContainerId: "navBarBox",
  footerContainerId: "footer_container",
  sidebarContainerId: "sidebar_div",
};

const attachNav = (containerId) => {
  const navContainer = document.getElementById(containerId);
  if (!navContainer) return;

  navContainer.innerHTML = navBar();

  setTimeout(() => {
    try {
      initUserProfile();
    } catch (err) {
      console.warn("Nav profile init failed", err);
    }

    const registerBtn = document.getElementById("register_btn");
    if (registerBtn) {
      registerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "register.html";
      });
    }

    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }
  }, 200);
};

const attachSidebar = (containerId) => {
  const sidebarContainer = document.getElementById(containerId);
  if (!sidebarContainer) return;

  try {
    sidebarContainer.innerHTML = sideBar();
    setTimeout(initSidebarInteractions, 200);
  } catch (err) {
    console.warn("Sidebar init skipped", err);
  }
};

const initSidebarInteractions = () => {
  const slidingSidebar = document.getElementById("side_bar");
  const openBtn = document.getElementById("sliding");
  const closeBtn = document.getElementById("sliding2");

  if (openBtn && slidingSidebar) {
    openBtn.addEventListener("click", () => {
      slidingSidebar.style.left = "0";
      slidingSidebar.style.background = "white";
    });
  }

  if (closeBtn && slidingSidebar) {
    closeBtn.addEventListener("click", () => {
      slidingSidebar.style.left = "-320px";
    });
  }

  const toggleConfigs = [
    { trigger: "ul1", target: "ul-1" },
    { trigger: "ul2", target: "ul-2" },
    { trigger: "ul3", target: "ul-3" },
  ];

  toggleConfigs.forEach(({ trigger, target }) => {
    const triggerEl = document.getElementById(trigger);
    const targetEl = document.getElementById(target);
    if (triggerEl && targetEl) {
      triggerEl.addEventListener("click", () => {
        if (targetEl.style.display === "") {
          targetEl.style.display = "none";
        } else if (targetEl.style.display === "none") {
          targetEl.style.display = "block";
        } else {
          targetEl.style.display = "none";
        }
      });
    }
  });
};

const attachFooter = (containerId) => {
  const footerContainer = document.getElementById(containerId);
  if (!footerContainer) return;
  footerContainer.innerHTML = footer();
};

export const bootstrapLayout = (options = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  attachNav(mergedOptions.navContainerId);
  attachSidebar(mergedOptions.sidebarContainerId);
  attachFooter(mergedOptions.footerContainerId);
  applyGlobalNavigation();
};

const autoInit = () => {
  bootstrapLayout();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoInit);
} else {
  autoInit();
}

