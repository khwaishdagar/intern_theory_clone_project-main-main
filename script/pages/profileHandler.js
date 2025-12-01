import { TokenManager, getCurrentUser } from '../auth.js';
import "../layout.js";

const initProfilePage = async () => {
    const container = document.getElementById('profileContent');
    if (!container) return;

    // Check Authentication
    const token = TokenManager.getToken();
    if (!token) {
        renderLoginState(container);
        return;
    }

    try {
        // Show Loading
        container.innerHTML = `
            <div style="text-align: center; padding: 60px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 40px; color: var(--primary-color);"></i>
                <p style="margin-top: 20px; color: var(--text-light);">Loading your profile...</p>
            </div>
        `;

        const response = await getCurrentUser();
        const user = response.user;

        if (!user) {
            throw new Error('User data not found');
        }

        renderProfile(container, user);

    } catch (error) {
        console.error('Error loading profile:', error);
        renderErrorState(container, error.message);
    }
};

const renderLoginState = (container) => {
    container.innerHTML = `
        <div class="profile-card" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 60px; color: #dc2626; margin-bottom: 20px;">
                <i class="fas fa-lock"></i>
            </div>
            <h2 style="margin-bottom: 15px;">Access Restricted</h2>
            <p style="color: var(--text-light); margin-bottom: 30px;">Please login to view your profile dashboard.</p>
            <a href="login.html" class="btn btn-primary">
                Login Now <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
};

const renderErrorState = (container, message) => {
    container.innerHTML = `
        <div class="profile-card" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 60px; color: #dc2626; margin-bottom: 20px;">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h2 style="margin-bottom: 15px;">Something went wrong</h2>
            <p style="color: var(--text-light); margin-bottom: 30px;">${message}</p>
            <a href="login.html" class="btn btn-secondary">
                Try Logging In Again
            </a>
        </div>
    `;
};

const renderProfile = (container, user) => {
    const initials = `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase();
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const userType = user.userType || 'student';

    container.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <div class="avatar-container">
                    <div class="avatar">${initials}</div>
                </div>
                <h1 class="profile-name">${fullName}</h1>
                <span class="profile-role">${userType}</span>
            </div>
            
            <div class="profile-body">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-envelope"></i> Email</div>
                        <div class="info-value">${user.email || 'Not provided'}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-phone"></i> Mobile</div>
                        <div class="info-value">${user.mobile || 'Not provided'}</div>
                    </div>

                    ${user.city ? `
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-map-marker-alt"></i> City</div>
                        <div class="info-value">${user.city}</div>
                    </div>
                    ` : ''}

                    ${user.qualification ? `
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-graduation-cap"></i> Qualification</div>
                        <div class="info-value">${user.qualification}</div>
                    </div>
                    ` : ''}

                    ${user.companyName ? `
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-building"></i> Company</div>
                        <div class="info-value">${user.companyName}</div>
                    </div>
                    ` : ''}
                </div>

                <div class="profile-actions">
                    <a href="dashboard.html" class="btn btn-primary">
                        <i class="fas fa-tachometer-alt"></i> Go to Dashboard
                    </a>
                    <a href="index.html" class="btn btn-secondary">
                        <i class="fas fa-home"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;
};

// Initialize
document.addEventListener('DOMContentLoaded', initProfilePage);
