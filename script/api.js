// Backend base url helpers
const API_PORT = 5000;
const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BACKEND_BASE_URL = isLocalHost
  ? `http://localhost:${API_PORT}`
  : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;

// API Base URL - Auto-detect or use localhost
const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

const buildBackendUrl = (path = "") => {
  if (!path) return BACKEND_BASE_URL;
  return `${BACKEND_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

// Landing Page API
const LandingPageAPI = {
  // Get all landing page data
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/landing`);
      if (!response.ok) throw new Error("Failed to fetch landing page data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching landing page:", error);
      return null;
    }
  },

  // Get specific section
  getSection: async (sectionType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/landing/sections/${sectionType}`);
      if (!response.ok) throw new Error("Failed to fetch section");
      return await response.json();
    } catch (error) {
      console.error("Error fetching section:", error);
      return null;
    }
  },

  // Get images
  getImages: async (category = null, page = null) => {
    try {
      let url = `${API_BASE_URL}/landing/images`;
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (page) params.append("page", page);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch images");
      return await response.json();
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  },
};

// Content API
const ContentAPI = {
  // Get register page content
  getRegisterContent: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/register`);
      if (!response.ok) throw new Error("Failed to fetch register content");
      return await response.json();
    } catch (error) {
      console.error("Error fetching register content:", error);
      return null;
    }
  },

  // Get login page content
  getLoginContent: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/login`);
      if (!response.ok) throw new Error("Failed to fetch login content");
      return await response.json();
    } catch (error) {
      console.error("Error fetching login content:", error);
      return null;
    }
  },
};

// Export for use in other files
export { LandingPageAPI, ContentAPI, API_BASE_URL, BACKEND_BASE_URL, buildBackendUrl };

