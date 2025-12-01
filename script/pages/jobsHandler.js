import "../layout.js";

const Jobs_data = [
    {
        id: 1,
        title: "Junior Data Scientist",
        company: "Thinklytics",
        logo: "assets/modi-pm.svg",
        category: "Analytics",
        city: "Bangalore",
        salary: "₹ 6 - 10 LPA",
        type: "Full Time",
        posted: "2 days ago"
    },
    {
        id: 2,
        title: "UX Research Associate",
        company: "Northstar Labs",
        logo: "assets/modi-pm.svg",
        category: "Product Design",
        city: "Mumbai",
        salary: "₹ 6 - 8 LPA",
        type: "Full Time",
        posted: "1 week ago"
    },
    {
        id: 3,
        title: "Frontend Developer",
        company: "TechCorp",
        logo: "assets/modi-pm.svg",
        category: "IT & Software",
        city: "Delhi",
        salary: "₹ 5 - 8 LPA",
        type: "Full Time",
        posted: "3 days ago"
    },
    {
        id: 4,
        title: "Digital Marketing Executive",
        company: "BrandBoost",
        logo: "assets/modi-pm.svg",
        category: "Marketing",
        city: "Pune",
        salary: "₹ 3 - 5 LPA",
        type: "Part Time",
        posted: "Just now"
    },
    {
        id: 5,
        title: "Business Analyst",
        company: "FinTech Solutions",
        logo: "assets/modi-pm.svg",
        category: "Finance",
        city: "Mumbai",
        salary: "₹ 7 - 12 LPA",
        type: "Full Time",
        posted: "5 days ago"
    },
    {
        id: 6,
        title: "Content Writer",
        company: "Creative Minds",
        logo: "assets/modi-pm.svg",
        category: "Content Writing",
        city: "Remote",
        salary: "₹ 3 - 6 LPA",
        type: "Work From Home",
        posted: "1 day ago"
    },
    {
        id: 7,
        title: "HR Generalist",
        company: "PeopleFirst",
        logo: "assets/modi-pm.svg",
        category: "Human Resources",
        city: "Bangalore",
        salary: "₹ 4 - 7 LPA",
        type: "Full Time",
        posted: "4 days ago"
    },
    {
        id: 8,
        title: "React Native Developer",
        company: "AppStudio",
        logo: "assets/modi-pm.svg",
        category: "Mobile Dev",
        city: "Hyderabad",
        salary: "₹ 8 - 15 LPA",
        type: "Full Time",
        posted: "2 weeks ago"
    }
];

const initJobsPage = () => {
    const container = document.querySelector(".internship-list");
    const citySelect = document.getElementById("city");
    const typeSelect = document.getElementById("work_type");
    const categorySelect = document.getElementById("category");

    if (!container) return;

    // Populate Filters
    const cities = [...new Set(Jobs_data.map(item => item.city))];
    const types = [...new Set(Jobs_data.map(item => item.type))];
    const categories = [...new Set(Jobs_data.map(item => item.category))];

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
    populateDropdown(typeSelect, types, "All Types");
    populateDropdown(categorySelect, categories, "All Categories");

    const renderJobs = (jobs) => {
        container.innerHTML = "";

        // Add Heading
        const heading = document.createElement("h2");
        heading.className = "section-title";
        heading.textContent = "Fresher Jobs";
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

            const applyBtn = document.createElement("a");
            applyBtn.href = "register.html";
            applyBtn.className = "apply-btn";
            applyBtn.innerHTML = `VIEW AND APPLY <i class="fi fi-rr-arrow-right"></i>`;

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

    if (citySelect) citySelect.addEventListener("change", applyFilters);
    if (typeSelect) typeSelect.addEventListener("change", applyFilters);
    if (categorySelect) categorySelect.addEventListener("change", applyFilters);

    // Initial Render
    renderJobs(Jobs_data);
};

initJobsPage();
