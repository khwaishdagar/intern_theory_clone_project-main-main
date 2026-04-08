import "../layout.js";

let Jobs_data = [];

const initJobsPage = async () => {
    const container = document.querySelector(".internship-list");
    const citySelect = document.getElementById("city");
    const typeSelect = document.getElementById("work_type");
    const categorySelect = document.getElementById("category");

    if (!container) return;

    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Loading Jobs from Skill India...</div>';

    try {
        // Fetch the scraped JSON file
        const res = await fetch('./skillindia_jobs.json');
        if (res.ok) {
            const rawData = await res.json();
            const sourceItems = rawData?.Data?.Results || rawData?.data || [];
            
            Jobs_data = sourceItems.map((job, index) => ({
                id: job.Id || job.JobId || index,
                title: job.JobTitle || "Job Role",
                company: job.CompanyName || "Skill India Partner",
                logo: "assets/modi-pm.svg",
                category: job.IndustryName || job.SectorName || "Industry",
                city: job.JobLocationDistrict || job.JobLocations || "Remote",
                salary: job.MinCtcMonthly ? `₹ ${job.MinCtcMonthly.toLocaleString()} - ${job.MaxCtcMonthly.toLocaleString()} / mo` : 'Not Disclosed',
                type: job.MinExperience > 0 ? `${job.MinExperience}+ Yrs Exp` : "Fresher",
                posted: job.VacancyCount ? `${job.VacancyCount} Openings` : "Apply"
            }));
        }
    } catch (err) {
        console.error("Error fetching Skill India jobs data:", err);
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: red;">Failed to load data. Please ensure you are running this from a local server.</div>';
        return;
    }

    // Populate Filters
    const cities = [...new Set(Jobs_data.map(item => item.city))].filter(Boolean);
    const types = [...new Set(Jobs_data.map(item => item.type))].filter(Boolean);
    const categories = [...new Set(Jobs_data.map(item => item.category))].filter(Boolean);

    const populateDropdown = (select, items, defaultText) => {
        if (!select) return;
        select.innerHTML = `<option value="">${defaultText}</option>`;
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        });
    };

    populateDropdown(citySelect, cities, "All Cities");
    populateDropdown(typeSelect, types, "Experience Level");
    populateDropdown(categorySelect, categories, "All Categories");

    const renderJobs = (jobs) => {
        container.innerHTML = "";

        // Add Heading
        const heading = document.createElement("h2");
        heading.className = "section-title";
        heading.textContent = "Fresher & Professional Jobs (Skill India)";
        container.appendChild(heading);

        if (jobs.length === 0) {
            const empty = document.createElement("p");
            empty.className = "list_empty_state";
            empty.textContent = "No jobs found matching your criteria.";
            empty.style.gridColumn = "1 / -1";
            empty.style.textAlign = "center";
            empty.style.padding = "40px";
            empty.style.color = "var(--text-light)";
            container.appendChild(empty);
            return;
        }

        jobs.forEach((job, index) => {
            const card = document.createElement("div");
            card.className = "internship-card";
            card.style.animationDelay = `${index * 0.1}s`;

            // Logo
            const logoDiv = document.createElement("div");
            logoDiv.className = "card-logo";
            const img = document.createElement("img");
            img.src = job.logo;
            img.alt = job.company;
            img.onerror = function () { this.src = 'https://via.placeholder.com/72?text=Logo'; };
            logoDiv.appendChild(img);

            // Content
            const contentDiv = document.createElement("div");
            contentDiv.className = "card-content";

            const title = document.createElement("h3");
            title.className = "card-title";
            title.textContent = job.title;

            const company = document.createElement("p");
            company.className = "card-company";
            company.textContent = job.company;

            const detailsDiv = document.createElement("div");
            detailsDiv.className = "card-details";

            const catBadge = document.createElement("span");
            catBadge.className = "detail-item";
            catBadge.textContent = job.category;

            const cityBadge = document.createElement("span");
            cityBadge.className = "detail-item";
            cityBadge.textContent = job.city;

            detailsDiv.append(catBadge, cityBadge);

            const typeBadge = document.createElement("div");
            typeBadge.className = "detail-item";
            typeBadge.style.marginTop = "8px";
            typeBadge.style.background = "#fff5f0";
            typeBadge.style.color = "var(--primary-color)";
            typeBadge.textContent = job.type;

            const salaryDiv = document.createElement("div");
            salaryDiv.style.marginTop = "8px";
            salaryDiv.style.fontSize = "13px";
            salaryDiv.style.fontWeight = "600";
            salaryDiv.style.color = "#495057";
            salaryDiv.textContent = `Salary: ${job.salary}`;

            contentDiv.append(title, company, detailsDiv, typeBadge, salaryDiv);

            // Actions
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "card-actions";

            const postedBadge = document.createElement("span");
            postedBadge.className = "duration-badge";
            postedBadge.textContent = job.posted;

            const shareIcon = document.createElement("i");
            shareIcon.className = "fi fi-sr-share share-icon";

            const applyBtn = document.createElement("button");
            applyBtn.className = "apply-btn";
            applyBtn.style.cursor = "pointer";
            applyBtn.innerHTML = `VIEW ON SKILL INDIA <i class="fi fi-rr-arrow-right"></i>`;
            applyBtn.onclick = () => window.open('https://www.skillindiadigital.gov.in/', '_blank');

            actionsDiv.append(postedBadge, shareIcon, applyBtn);

            card.append(logoDiv, contentDiv, actionsDiv);
            container.appendChild(card);
        });
    };

    const applyFilters = () => {
        const city = citySelect ? citySelect.value : "";
        const type = typeSelect ? typeSelect.value : "";
        const category = categorySelect ? categorySelect.value : "";

        const filtered = Jobs_data.filter(job => {
            return (city === "" || job.city === city) &&
                (type === "" || job.type === type) &&
                (category === "" || job.category === category);
        });

        renderJobs(filtered);
    };

    // Attach search button listener if exists
    const searchBtn = document.querySelector(".apply-btn");
    if(searchBtn) {
        searchBtn.addEventListener("click", applyFilters);
    }
    
    if (citySelect) citySelect.addEventListener("change", applyFilters);
    if (typeSelect) typeSelect.addEventListener("change", applyFilters);
    if (categorySelect) categorySelect.addEventListener("change", applyFilters);

    // Initial Render
    renderJobs(Jobs_data);
};

initJobsPage();
