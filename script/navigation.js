const ROUTES = Object.freeze({
  home: "index.html",
  skillCourses: "courses.html",
  onlineCourses: "onlinecourses.html",
  classroomTraining: "classTraining.html",
  internships: "internship.html",
  jobs: "jobs.html",
  jobExchange: "jobs.html",
  skillCentre: "state-skill-missions.html",
  contact: "contract.html",
  register: "register.html",
  login: "login.html",
  dashboard: "dashboard.html",
  profile: "profile.html",
  partner: "partner-with-msde.html",
  cart: "cartPage1.html",
  otp: "otp.html",
  payment: "pay.html",
});

const normalizeRoute = (routeKey) => ROUTES[routeKey] || routeKey || ROUTES.home;

const bindRoute = (element) => {
  const routeKey = element.dataset.route;
  if (!routeKey || element.dataset.routeBound) return;

  const target = normalizeRoute(routeKey);

  if (element.tagName === "A" && !element.getAttribute("href")) {
    element.setAttribute("href", target);
  } else if (element.tagName !== "A") {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = target;
    });
  }

  element.dataset.routeBound = "true";
};

const ensureCtaRoutes = () => {
  const mappings = [
    { selector: "#reach_out_btn", route: "contact" },
    { selector: ".register_button", route: "register" },
    { selector: ".next_button", route: "register" },
    { selector: ".opportunity_button", route: "skillCourses" },
  ];

  mappings.forEach(({ selector, route }) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.dataset.route) {
        if (selector === ".opportunity_button" && index === 1) {
          el.dataset.route = "jobs";
        } else {
          el.dataset.route = route;
        }
      }
      bindRoute(el);
    });
  });

  document.querySelectorAll(".explore_learn_button").forEach((btn, index) => {
    if (!btn.dataset.route) {
      btn.dataset.route =
        ["onlineCourses", "jobs", "partner"][index] || "skillCourses";
    }
    bindRoute(btn);
  });
};

const applyGlobalNavigation = () => {
  document.querySelectorAll("[data-route]").forEach(bindRoute);
  ensureCtaRoutes();
};

export { ROUTES, applyGlobalNavigation };

