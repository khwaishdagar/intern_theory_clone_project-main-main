import "../layout.js";
import { buildBackendUrl } from "../api.js";

const initJobsPage = async () => {
    const container = document.querySelector(".internship-list");
    const citySelect = document.getElementById("city");
    const typeSelect = document.getElementById("work_type");
    const categorySelect = document.getElementById("category");

    if (!container) return;

    let allData = [];

    const fetchJobs = async () => {
        try {
            const res = await fetch(buildBackendUrl("/job"));
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            return [];
        }
    };

    const populateDropdown = (select, items, defaultText) => {
        if (!select) return;
        select.innerHTML = `<option value="">${defaultText}</option>`;
        items.sort().forEach(item => {
            if (!item) return;
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        });
    };

    const renderJobs = (jobs) => {
        container.innerHTML = "";

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
            container.appendChild(empty);
            return;
        }

        jobs.forEach((job, index) => {
            const card = document.createElement("div");
            card.className = "internship-card";
            card.style.animationDelay = `${index * 0.05}s`;

            const logoDiv = document.createElement("div");
            logoDiv.className = "card-logo";
            const img = document.createElement("img");
            img.src = job.img || "https://assets.interntheory.com/creative/logo.png";
            img.alt = job.name;
            img.onerror = function () { this.src = 'https://assets.interntheory.com/creative/logo.png'; };
            logoDiv.appendChild(img);

            const contentDiv = document.createElement("div");
            contentDiv.className = "card-content";

            const title = document.createElement("h3");
            title.className = "card-title";
            title.textContent = job.title;

            const company = document.createElement("p");
            company.className = "card-company";
            company.textContent = job.name;

            const detailsDiv = document.createElement("div");
            detailsDiv.className = "card-details";

            const industryBadge = document.createElement("span");
            industryBadge.className = "detail-item";
            industryBadge.innerHTML = `<i class="fas fa-briefcase"></i> ${job.industry || "General"}`;

            const cityBadge = document.createElement("span");
            cityBadge.className = "detail-item";
            cityBadge.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${job.city || "India"}`;

            detailsDiv.append(industryBadge, cityBadge);

            const salaryDiv = document.createElement("div");
            salaryDiv.className = "detail-item";
            salaryDiv.style.marginTop = "8px";
            salaryDiv.style.fontWeight = "600";
            salaryDiv.innerHTML = `<i class="fas fa-money-bill-wave"></i> Stipend: ${job.Stipend || "Negotiable"}`;

            contentDiv.append(title, company, detailsDiv, salaryDiv);

            const actionsDiv = document.createElement("div");
            actionsDiv.className = "card-actions";

            const postedBadge = document.createElement("span");
            postedBadge.className = "duration-badge";
            postedBadge.textContent = job.weeks || "Permanent";

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
        const industry = categorySelect ? categorySelect.value : "";

        const filtered = allData.filter(job => {
            return (city === "" || job.city === city) &&
                (type === "" || (job.time && job.time.includes(type))) &&
                (industry === "" || job.industry === industry);
        });

        renderJobs(filtered);
    };

    // Load Data
    allData = await fetchJobs();

    // Setup Filters
    const cities = [...new Set(allData.map(item => item.city))];
    const industries = [...new Set(allData.map(item => item.industry))];

    populateDropdown(citySelect, cities, "All Cities");
    populateDropdown(categorySelect, industries, "All Categories");

    if (citySelect) citySelect.addEventListener("change", applyFilters);
    if (typeSelect) typeSelect.addEventListener("change", applyFilters);
    if (categorySelect) categorySelect.addEventListener("change", applyFilters);

    // Initial Render
    renderJobs(allData);
};

initJobsPage();
