import "../layout.js";
import { appendOnlineData } from "../CourseData.js";
import { initCourseListing } from "./courseListing.js";

const initOnlineCoursesPage = () => {
  initCourseListing({
    endpoint: "/online",
    containerId: "onc_main",
    appendFn: appendOnlineData,
    emptyMessage: "No online courses are published yet. Please check again soon.",
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOnlineCoursesPage);
} else {
  initOnlineCoursesPage();
}

