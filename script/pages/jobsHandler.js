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

    // Returns initials from company name for logo placeholder
    const getInitials = (name = "") => {
        return name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
    };

    const buildCard = (job, index) => {
        const card = document.createElement("div");
        card.className = "internship-card";
        card.style.animationDelay = `${index * 0.06}s`;

        /* ── Card Inner wrapper ── */
        const inner = document.createElement("div");
        inner.className = "card-inner";

        /* ── Header row: logo + title + company ── */
        const header = document.createElement("div");
        header.className = "card-header";

        // Logo
        const logoDiv = document.createElement("div");
        logoDiv.className = "card-logo";

        if (job.img) {
            const img = document.createElement("img");
            img.src = job.img;
            img.alt = job.name || "Company";
            img.onerror = function () {
                this.parentElement.innerHTML = `<div class="card-logo-placeholder">${getInitials(job.name)}</div>`;
            };
            logoDiv.appendChild(img);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "card-logo-placeholder";
            placeholder.textContent = getInitials(job.name);
            logoDiv.appendChild(placeholder);
        }

        // Title + Company block
        const titleBlock = document.createElement("div");
        titleBlock.className = "card-title-block";

        const title = document.createElement("h3");
        title.className = "card-title";
        title.textContent = job.title || "Job Opening";

        const company = document.createElement("p");
        company.className = "card-company";
        company.textContent = job.name || "Company";

        titleBlock.append(title, company);
        header.append(logoDiv, titleBlock);

        /* ── Body: badges ── */
        const body = document.createElement("div");
        body.className = "card-body";

        const details = document.createElement("div");
        details.className = "card-details";

        if (job.industry) {
            const industryBadge = document.createElement("span");
            industryBadge.className = "detail-item";
            industryBadge.innerHTML = `<i class="fi fi-sr-briefcase"></i> ${job.industry}`;
            details.appendChild(industryBadge);
        }

        if (job.city) {
            const cityBadge = document.createElement("span");
            cityBadge.className = "detail-item";
            cityBadge.innerHTML = `<i class="fi fi-sr-marker"></i> ${job.city}`;
            details.appendChild(cityBadge);
        }

        body.appendChild(details);

        // Stipend / Salary row
        const salaryLabel = job.Stipend || job.salary || "Negotiable";
        const salaryRow = document.createElement("div");
        salaryRow.className = "card-stipend";
        salaryRow.innerHTML = `<i class="fi fi-sr-money-bill-wave"></i><span>Stipend: ${salaryLabel}</span>`;
        body.appendChild(salaryRow);

        inner.append(header, body);

        /* ── Actions footer ── */
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "card-actions";

        const postedBadge = document.createElement("span");
        postedBadge.className = "duration-badge";
        postedBadge.textContent = job.weeks || "PERMANENT";

        const shareIcon = document.createElement("i");
        shareIcon.className = "fi fi-sr-share share-icon";

        const applyBtn = document.createElement("a");
        applyBtn.href = "register.html";
        applyBtn.className = "apply-btn";
        applyBtn.innerHTML = `VIEW AND APPLY <i class="fi fi-rr-arrow-right"></i>`;

        actionsDiv.append(postedBadge, shareIcon, applyBtn);

        card.append(inner, actionsDiv);
        return card;
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
            container.appendChild(empty);
            return;
        }

        jobs.forEach((job, index) => {
            container.appendChild(buildCard(job, index));
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
