import { TokenManager, logout } from './auth.js';
import userProfile from '../component/userProfile.js';

// Initialize user profile in navbar
const initUserProfile = () => {
  try {
    const user = TokenManager.getUser();
    const authButtonsContainer = document.getElementById('auth_buttons_container');
    const userProfileSection = document.getElementById('user_profile_section');

    if (user && userProfileSection && authButtonsContainer) {
      // User is logged in - show profile, hide auth buttons
      authButtonsContainer.style.display = 'none';
      userProfileSection.style.display = 'block';
      userProfileSection.innerHTML = userProfile(user);

      // Setup dropdown toggle after a small delay to ensure DOM is ready
      setTimeout(() => {
        const profileBtn = document.getElementById('user_profile_btn');
        const dropdown = document.getElementById('user_profile_dropdown');
        const logoutBtn = document.getElementById('logout_btn');

        if (profileBtn && dropdown) {
          // Remove existing listeners to avoid duplicates
          const newProfileBtn = profileBtn.cloneNode(true);
          profileBtn.parentNode.replaceChild(newProfileBtn, profileBtn);

          // Get fresh references after clone
          const freshProfileBtn = document.getElementById('user_profile_btn');
          const freshDropdown = document.getElementById('user_profile_dropdown');

          freshProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = freshDropdown.classList.contains('show');
            if (isVisible) {
              freshDropdown.style.opacity = '0';
              freshDropdown.style.transform = 'translateY(-10px) scale(0.95)';
              setTimeout(() => {
                freshDropdown.classList.remove('show');
                freshDropdown.style.display = 'none';
              }, 300);
            } else {
              freshDropdown.style.display = 'block';
              // Trigger reflow for animation
              freshDropdown.offsetHeight;
              freshDropdown.classList.add('show');
              setTimeout(() => {
                freshDropdown.style.opacity = '1';
                freshDropdown.style.transform = 'translateY(0) scale(1)';
              }, 10);
            }
          });

          // Close dropdown when clicking outside
          const closeDropdown = (e) => {
            if (freshProfileBtn && freshDropdown &&
              !freshProfileBtn.contains(e.target) &&
              !freshDropdown.contains(e.target)) {
              freshDropdown.style.opacity = '0';
              freshDropdown.style.transform = 'translateY(-10px) scale(0.95)';
              setTimeout(() => {
                freshDropdown.classList.remove('show');
                freshDropdown.style.display = 'none';
              }, 300);
            }
          };

          // Remove old listener and add new one
          document.removeEventListener('click', closeDropdown);
          setTimeout(() => {
            document.addEventListener('click', closeDropdown);
          }, 100);
        }

        // Handle logout
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
          });
        }
      }, 100);
    } else {
      // User is not logged in - show auth buttons, hide profile
      if (authButtonsContainer) {
        authButtonsContainer.style.display = 'flex';
      }
      if (userProfileSection) {
        userProfileSection.style.display = 'none';
      }
    }

    // Dashboard button click handler removed to allow direct navigation

  } catch (error) {
    console.error('Error initializing user profile:', error);
    // Fallback: show auth buttons if there's an error
    const authButtonsContainer = document.getElementById('auth_buttons_container');
    const userProfileSection = document.getElementById('user_profile_section');
    if (authButtonsContainer) {
      authButtonsContainer.style.display = 'flex';
    }
    if (userProfileSection) {
      userProfileSection.style.display = 'none';
    }
  }
};

// Auto-initialize on page load (only if not already called manually)
// This ensures it works even if imported after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initUserProfile, 500);
  });
} else {
  // DOM already loaded, wait a bit for navbar to render
  setTimeout(initUserProfile, 500);
}

export { initUserProfile };

