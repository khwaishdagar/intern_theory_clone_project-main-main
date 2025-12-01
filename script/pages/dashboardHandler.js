import { TokenManager, getCurrentUser } from '../auth.js';
import "../layout.js";

// Dummy Data for Dashboard
const APPLIED_DATA = [
    {
        id: 1,
        title: "Business Development Intern",
        company: "GrowthHacker",
        appliedDate: "12 Oct 2023",
        status: "Applied",
        logo: "https://assets.interntheory.com/creative/logo.png"
    },
    {
        id: 2,
        title: "Graphic Design Intern",
        company: "PixelPerfect",
        appliedDate: "10 Oct 2023",
        status: "Shortlisted",
        logo: "https://assets.interntheory.com/creative/logo.png"
    }
];

const ENROLLED_COURSES = [
    {
        id: 101,
        title: "Full Stack Web Development",
        progress: 40,
        logo: "https://assets.interntheory.com/creative/logo.png"
    },
    {
        id: 102,
        title: "Digital Marketing Masterclass",
        progress: 10,
        logo: "https://assets.interntheory.com/creative/logo.png"
    }
];

const initDashboard = async () => {
    const container = document.getElementById('dashboardContent');
    if (!container) return;

    // Check Authentication
    const token = TokenManager.getToken();
    if (!token) {
        renderLoginState(container);
        return;
    }

    try {
        const response = await getCurrentUser();
        const user = response.user;

        if (!user) throw new Error('User not found');

        renderDashboard(container, user);

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="error-message">Error loading dashboard. Please login again.</p>`;
    }
};

const renderLoginState = (container) => {
    container.innerHTML = `
        <div style="text-align: center; padding: 60px;">
            <h2>Please Login</h2>
            <p>Access your dashboard to view applications.</p>
            <a href="login.html" class="btn-small">Login</a>
        </div>
    `;
};

const renderDashboard = (container, user) => {
    const firstName = user.firstName || 'User';

    container.innerHTML = `
        <div class="dashboard-header">
            <h1>Welcome back, ${firstName}!</h1>
            <p>Track your applications and learning progress here.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="stat-info">
                    <h3>My Internships</h3>
                    <div class="value">${APPLIED_DATA.length}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-book"></i>
                </div>
                <div class="stat-info">
                    <h3>Enrolled Courses</h3>
                    <div class="value">${ENROLLED_COURSES.length}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="stat-info">
                    <h3>Profile Status</h3>
                    <div class="value">100%</div>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <!-- Left Column: Applications -->
            <div class="card-section">
                <div class="section-title">
                    <i class="fas fa-paper-plane"></i> My Internships
                </div>
                <div class="applications-list">
                    ${renderApplicationsList()}
                </div>
            </div>

            <!-- Right Column: Courses -->
            <div class="card-section">
                <div class="section-title">
                    <i class="fas fa-graduation-cap"></i> My Courses
                </div>
                <div class="courses-list">
                    ${renderCoursesList()}
                </div>
            </div>
        </div>
    `;
};

const renderApplicationsList = () => {
    if (APPLIED_DATA.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>You haven't applied to any internships yet.</p>
                <a href="internship.html" class="btn-small">Browse Internships</a>
            </div>
        `;
    }

    return APPLIED_DATA.map(item => `
        <div class="list-item">
            <img src="${item.logo}" class="item-logo" alt="Logo">
            <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="item-subtitle">${item.company} • Applied: ${item.appliedDate}</div>
            </div>
            <div class="item-status status-applied">${item.status}</div>
        </div>
    `).join('');
};

const renderCoursesList = () => {
    if (ENROLLED_COURSES.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>You are not enrolled in any courses.</p>
                <a href="courses.html" class="btn-small">Browse Courses</a>
            </div>
        `;
    }

    return ENROLLED_COURSES.map(item => `
        <div class="list-item">
            <img src="${item.logo}" class="item-logo" alt="Logo">
            <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.progress}%"></div>
                </div>
                <div class="item-subtitle" style="margin-top: 4px;">${item.progress}% Complete</div>
            </div>
        </div>
    `).join('');
};

document.addEventListener('DOMContentLoaded', initDashboard);
