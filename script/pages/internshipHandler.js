import "../layout.js";

const Internships_data = [
    {
        id: 1,
        title: "Business Development Intern",
        company: "GrowthHacker",
        logo: "https://assets.interntheory.com/creative/logo.png",
        category: "Business",
        city: "Pune",
        stipend: "₹ 10,000 + Incentives",
        type: "Full Time",
        weeks: "Applied",
        isCourse: false
    },
    {
        id: 2,
        title: "Graphic Design Intern",
        company: "PixelPerfect",
        logo: "https://assets.interntheory.com/creative/logo.png",
        category: "Design",
        city: "Remote",
        stipend: "₹ 8,000 / month",
        type: "Work From Home",
        weeks: "Shortlisted",
        isCourse: false
    },
    {
        id: 3,
        title: "Full Stack Web Development",
        company: "InternTheory",
        logo: "https://assets.interntheory.com/creative/logo.png",
        category: "Development",
        city: "Online",
        stipend: "Course",
        type: "Self Paced",
        weeks: "Enrolled",
        isCourse: true
    },
    {
        id: 4,
        title: "Digital Marketing Masterclass",
        company: "InternTheory",
        logo: "https://assets.interntheory.com/creative/logo.png",
        category: "Marketing",
        city: "Online",
        stipend: "Course",
        type: "Self Paced",
        weeks: "Enrolled",
        isCourse: true
    }
];

const initInternshipPage = () => {
    const container = document.querySelector(".internship-list");
    const citySelect = document.getElementById("city");
    const typeSelect = document.getElementById("work_type");
    const categorySelect = document.getElementById("category");

    if (!container) return;

    // Populate Filters
    const cities = [...new Set(Internships_data.map(item => item.city))];
    const types = [...new Set(Internships_data.map(item => item.type))];
    const categories = [...new Set(Internships_data.map(item => item.category))];

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

    const renderInternships = (items) => {
        container.innerHTML = "";

        // Add Heading
        const heading = document.createElement("h2");
        heading.className = "section-title";
        heading.textContent = "My Applications & Enrollments";
        container.appendChild(heading);

        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.className = "list_empty_state";
            empty.textContent = "No applications found.";
            empty.style.gridColumn = "1 / -1";
            empty.style.textAlign = "center";
            empty.style.padding = "40px";
            empty.style.color = "var(--text-light)";
            container.appendChild(empty);
            return;
        }

        items.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "internship-card";
            card.style.animationDelay = `${index * 0.1}s`;

            // Logo
            const logoDiv = document.createElement("div");
            logoDiv.className = "card-logo";
            const img = document.createElement("img");
            img.src = item.logo;
            img.alt = item.company;
            img.onerror = function () { this.src = 'https://via.placeholder.com/72?text=Logo'; };
            logoDiv.appendChild(img);

            // Content
            const contentDiv = document.createElement("div");
            contentDiv.className = "card-content";

            const title = document.createElement("h3");
            title.className = "card-title";
            title.textContent = item.title;

            const company = document.createElement("p");
            company.className = "card-company";
            company.textContent = item.company;

            const detailsDiv = document.createElement("div");
            detailsDiv.className = "card-details";

            const catBadge = document.createElement("span");
            catBadge.className = "detail-item";
            catBadge.textContent = item.category;

            const cityBadge = document.createElement("span");
            cityBadge.className = "detail-item";
            cityBadge.textContent = item.city;

            detailsDiv.append(catBadge, cityBadge);

            const typeBadge = document.createElement("div");
            typeBadge.className = "detail-item";
            typeBadge.style.marginTop = "8px";
            typeBadge.style.background = "#fff5f0";
            typeBadge.style.color = "var(--primary-color)";
            typeBadge.textContent = item.type;

            const stipendDiv = document.createElement("div");
            stipendDiv.style.marginTop = "8px";
            stipendDiv.style.fontSize = "13px";
            stipendDiv.style.fontWeight = "600";
            stipendDiv.style.color = "#495057";
            stipendDiv.textContent = item.isCourse ? "Course Content" : `Stipend: ${item.stipend}`;

            contentDiv.append(title, company, detailsDiv, typeBadge, stipendDiv);

            // Actions
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "card-actions";

            const statusBadge = document.createElement("span");
            statusBadge.className = "duration-badge";
            statusBadge.style.background = item.weeks === "Enrolled" ? "#10b981" : "#3b82f6";
            statusBadge.textContent = item.weeks;

            const shareIcon = document.createElement("i");
            shareIcon.className = "fi fi-sr-share share-icon";

            // Status Button (No Link)
            const statusBtn = document.createElement("button");
            statusBtn.className = "apply-btn";
            statusBtn.style.cursor = "default";
            statusBtn.style.background = "#f0fdf4";
            statusBtn.style.color = "#16a34a";
            statusBtn.style.borderColor = "#16a34a";
            statusBtn.innerHTML = item.isCourse ? `CONTINUE <i class="fi fi-rr-play"></i>` : `STATUS: ${item.weeks.toUpperCase()}`;

            if (item.isCourse) {
                statusBtn.style.cursor = "pointer";
                statusBtn.onclick = () => alert("Redirecting to course...");
            }

            actionsDiv.append(statusBadge, shareIcon, statusBtn);

            card.append(logoDiv, contentDiv, actionsDiv);
            container.appendChild(card);
        });
    };

    const applyFilters = () => {
        const city = citySelect ? citySelect.value : "";
        const type = typeSelect ? typeSelect.value : "";
        const category = categorySelect ? categorySelect.value : "";

        const filtered = Internships_data.filter(item => {
            return (city === "" || item.city === city) &&
                (type === "" || item.type === type) &&
                (category === "" || item.category === category);
        });

        renderInternships(filtered);
    };

    if (citySelect) citySelect.addEventListener("change", applyFilters);
    if (typeSelect) typeSelect.addEventListener("change", applyFilters);
    if (categorySelect) categorySelect.addEventListener("change", applyFilters);

    // Initial Render
    renderInternships(Internships_data);
};

initInternshipPage();
