// API Base URL - Update this with your backend URL
const API_BASE_URL = `${window.location.protocol === 'https:' ? 'https' : 'http'}://${window.location.hostname}:5000/api/auth`;

// Token Management
const TokenManager = {
  setToken: (token) => {
    localStorage.setItem("authToken", token);
  },
  getToken: () => {
    return localStorage.getItem("authToken");
  },
  removeToken: () => {
    localStorage.removeItem("authToken");
  },
  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

// API Helper Functions
const apiCall = async (url, options = {}) => {
  try {
    const token = TokenManager.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // If there are specific validation errors, include them in the error message
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const errorMessage = data.message || "Validation failed";
        const errorDetails = data.errors.join(", ");
        throw new Error(`${errorMessage}: ${errorDetails}`);
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Register User
const registerUser = async (userData) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token && response.user) {
      TokenManager.setToken(response.token);
      TokenManager.setUser(response.user);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Login User
const loginUser = async (email, password) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token && response.user) {
      TokenManager.setToken(response.token);
      TokenManager.setUser(response.user);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Get Current User
const getCurrentUser = async () => {
  try {
    const response = await apiCall(`${API_BASE_URL}/me`);
    return response;
  } catch (error) {
    TokenManager.clearAuth();
    throw error;
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!TokenManager.getToken();
};

// Logout
const logout = () => {
  TokenManager.clearAuth();
  window.location.href = "index.html";
};

// Export for use in other files (ES6 modules)
export {
  registerUser,
  loginUser,
  getCurrentUser,
  isAuthenticated,
  logout,
  TokenManager,
};

