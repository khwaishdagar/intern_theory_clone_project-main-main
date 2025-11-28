import "../layout.js";
import { appendclassroomData } from "../CourseData.js";
import { initCourseListing } from "./courseListing.js";

const initClassroomPage = () => {
  initCourseListing({
    endpoint: "/classroom",
    containerId: "train_main",
    appendFn: appendclassroomData,
    emptyMessage: "No classroom batches are open right now.",
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClassroomPage);
} else {
  initClassroomPage();
}

