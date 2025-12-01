
function navBar() {
    var navbar = `<div id="nav_bar">
        <div id="top_strip"></div>
        <div id="nav_main">
            <div id="left_box">
                <div id="ashoka_emblem">
                    <img src="assets/national_logo.webp" alt="Ashoka Chakra">
                    <p>सत्यमेव जयते</p>
                </div>
                <div id="ministry_text">
                    <p class="hindi_text">कौशल विकास और उद्यमशीलता मंत्रालय</p>
                    <p class="english_text">MINISTRY OF SKILL DEVELOPMENT AND ENTREPRENEURSHIP</p>
                </div>
                <div id="skill_india_logo">
                    <a href="index.html">
                        <img src="assets/pm-internship-logo.png" alt="PM Internship" style="height: 60px; width: auto;">
                    </a>
                </div>
            </div>

            <div id="middle_box">
                <form id="search_bar_container" action="courses.html" method="get">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #999; margin-left: 10px;">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" id="search_input" name="interest" placeholder="Search skill or location">
                </form>
            </div>

            <div id="right_box">
                <a id="dashboards_btn" href="/dashboard.html" data-route="dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Dashboards</span>
                </a>
                
                <div id="auth_buttons_container">
                    <a href="register.html" id="register_btn">REGISTER</a>
                    <a href="login.html" id="login_btn">LOGIN</a>
                </div>
                <div id="user_profile_section" style="display: none;"></div>
            </div>
        </div>
        
        <!-- Secondary Navigation Bar -->
        <div id="secondary_navigation">
            <nav id="secondary_nav_items">
                <a href="courses.html" class="secondary_nav_item" id="skill_courses_secondary_link" data-route="skillCourses">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                    <span>Skill Courses</span>
                </a>
                <a href="jobs.html" class="secondary_nav_item" id="job_exchange_secondary_link" data-route="jobs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>Job Exchange</span>
                </a>
                <a href="skill-centre.html" class="secondary_nav_item" id="skill_centre_secondary_link" data-route="skillCentre">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span>Skill Centre</span>
                </a>
                <a href="partner-with-msde.html" class="secondary_nav_item" id="more_options_link" data-route="partner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                </a>
            </nav>
        </div>
    </div>`
    return navbar;
}

export default navBar
