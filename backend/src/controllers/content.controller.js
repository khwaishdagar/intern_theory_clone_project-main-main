const express = require("express");
const router = express.Router();

// Get register page content
router.get("/register", async (req, res) => {
  try {
    const content = {
      title: "Create Account",
      subtitle: "Already have an account?",
      loginLink: "login.html",
      socialOptions: {
        google: {
          enabled: true,
          text: "REGISTER WITH GOOGLE"
        },
        facebook: {
          enabled: true,
          text: "REGISTER WITH FACEBOOK"
        }
      },
      formFields: {
        student: {
          required: ["firstName", "lastName", "email", "mobile", "password"],
          optional: ["city", "qualification"]
        },
        company: {
          required: ["firstName", "lastName", "email", "mobile", "password"],
          optional: ["companyName", "companyAddress"]
        }
      }
    };
    
    return res.status(200).json(content);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get login page content
router.get("/login", async (req, res) => {
  try {
    const content = {
      title: "Welcome Back",
      subtitle: "Don't have an account?",
      registerLink: "register.html",
      socialOptions: {
        google: {
          enabled: true,
          text: "SIGNIN WITH GOOGLE"
        },
        facebook: {
          enabled: true,
          text: "SIGNIN WITH FACEBOOK"
        }
      },
      features: {
        rememberMe: true,
        forgotPassword: true
      }
    };
    
    return res.status(200).json(content);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

