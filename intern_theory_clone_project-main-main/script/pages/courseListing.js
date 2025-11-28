import { buildBackendUrl } from "../api.js";

const CART_KEY = "internTheoryCart";
const TOAST_ID = "course_toast_message";

const ensureToastHost = () => {
  let toast = document.getElementById(TOAST_ID);
  if (!toast) {
    toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.right = "30px";
    toast.style.padding = "14px 24px";
    toast.style.background =
      "linear-gradient(135deg, rgba(0,102,204,0.95), rgba(255,102,0,0.95))";
    toast.style.color = "#fff";
    toast.style.borderRadius = "999px";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.pointerEvents = "none";
    document.body.appendChild(toast);
  }
  return toast;
};

const showToast = (message) => {
  const toast = ensureToastHost();
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 2200);
};

const storeCourse = (course) => {
  const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const existingIndex = stored.findIndex((item) => item.title === course.title);
  if (existingIndex >= 0) {
    const existing = stored[existingIndex];
    stored[existingIndex] = {
      ...existing,
      count: (existing.count || 1) + 1,
    };
  } else {
    stored.push({ ...course, count: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(stored));
  showToast(`${course.title} saved to your cart`);
};

const attachCourseInteractions = (root, data) => {
  const actionButtons = root.querySelectorAll(".btn");
  actionButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const course = data[index];
      if (course) {
        storeCourse(course);
      }
    });
  });

  const knowButtons = root.querySelectorAll(".know");
  knowButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const course = data[index];
      const description = course?.description || "Course details coming soon.";
      alert(description);
    });
  });
};

const renderFallback = (container, message) => {
  container.innerHTML = `
    <div style="
      padding: 30px;
      text-align: center;
      border: 2px dashed #d1d5db;
      border-radius: 16px;
      background: #fff;
      color: #6b7280;
      font-size: 16px;
    ">
      ${message}
    </div>
  `;
};

const initCourseListing = async ({
  endpoint,
  containerId,
  appendFn,
  emptyMessage = "No courses available right now.",
}) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(buildBackendUrl(endpoint));
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      renderFallback(container, emptyMessage);
      return;
    }

    container.innerHTML = "";
    appendFn(data, container);
    attachCourseInteractions(container, data);
  } catch (error) {
    console.error(error);
    renderFallback(
      container,
      "Unable to load courses right now. Please try again later."
    );
  }
};

export { initCourseListing };

