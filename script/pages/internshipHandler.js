import "../layout.js";
import { buildBackendUrl } from "../api.js";

const initInternshipPage = async () => {
    const container = document.querySelector(".internship-list");
    const citySelect = document.getElementById("city");
    const typeSelect = document.getElementById("work_type");
    const categorySelect = document.getElementById("category");

    if (!container) return;

    let allData = [];

    const fetchInternships = async () => {
        try {
            const res = await fetch(buildBackendUrl("/internship"));
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch internships:", err);
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

    const buildCard = (item, index) => {
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

        if (item.img) {
            const img = document.createElement("img");
            img.src = item.img;
            img.alt = item.name || "Company";
            img.onerror = function () {
                this.parentElement.innerHTML = `<div class="card-logo-placeholder">${getInitials(item.name)}</div>`;
            };
            logoDiv.appendChild(img);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "card-logo-placeholder";
            placeholder.textContent = getInitials(item.name);
            logoDiv.appendChild(placeholder);
        }

        // Title + Company block
        const titleBlock = document.createElement("div");
        titleBlock.className = "card-title-block";

        const title = document.createElement("h3");
        title.className = "card-title";
        title.textContent = item.title || "Internship";

        const company = document.createElement("p");
        company.className = "card-company";
        company.textContent = item.name || "Company";

        titleBlock.append(title, company);
        header.append(logoDiv, titleBlock);

        /* ── Body: badges ── */
        const body = document.createElement("div");
        body.className = "card-body";

        const details = document.createElement("div");
        details.className = "card-details";

        if (item.industry) {
            const industryBadge = document.createElement("span");
            industryBadge.className = "detail-item";
            industryBadge.innerHTML = `<i class="fi fi-sr-briefcase"></i> ${item.industry}`;
            details.appendChild(industryBadge);
        }

        if (item.city) {
            const cityBadge = document.createElement("span");
            cityBadge.className = "detail-item";
            cityBadge.innerHTML = `<i class="fi fi-sr-marker"></i> ${item.city}`;
            details.appendChild(cityBadge);
        }

        if (item.time) {
            const timeBadge = document.createElement("span");
            timeBadge.className = "detail-item";
            timeBadge.innerHTML = `<i class="fi fi-sr-clock"></i> ${item.time}`;
            details.appendChild(timeBadge);
        }

        body.appendChild(details);

        // Stipend row
        if (item.Stipend) {
            const stipendRow = document.createElement("div");
            stipendRow.className = "card-stipend";
            stipendRow.innerHTML = `<i class="fi fi-sr-money-bill-wave"></i><span>Stipend: ${item.Stipend}</span>`;
            body.appendChild(stipendRow);
        }

        inner.append(header, body);

        /* ── Actions footer ── */
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "card-actions";

        const durationBadge = document.createElement("span");
        durationBadge.className = "duration-badge";
        durationBadge.textContent = item.weeks || "4-6 Weeks";

        const shareIcon = document.createElement("i");
        shareIcon.className = "fi fi-sr-share share-icon";

        const applyBtn = document.createElement("a");
        applyBtn.className = "apply-btn";
        applyBtn.href = "register.html";
        applyBtn.innerHTML = `VIEW AND APPLY <i class="fi fi-rr-arrow-right"></i>`;

        actionsDiv.append(durationBadge, shareIcon, applyBtn);

        card.append(inner, actionsDiv);
        return card;
    };

    const renderInternships = (items) => {
        container.innerHTML = "";

        const heading = document.createElement("h2");
        heading.className = "section-title";
        heading.textContent = "Latest Internships";
        container.appendChild(heading);

        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.className = "list_empty_state";
            empty.textContent = "No opportunities match your filters.";
            container.appendChild(empty);
            return;
        }

        items.forEach((item, index) => {
            container.appendChild(buildCard(item, index));
        });
    };

    const applyFilters = () => {
        const city = citySelect ? citySelect.value : "";
        const type = typeSelect ? typeSelect.value : "";
        const industry = categorySelect ? categorySelect.value : "";

        const filtered = allData.filter(item => {
            return (city === "" || item.city === city) &&
                (type === "" || (item.time && item.time.includes(type))) &&
                (industry === "" || item.industry === industry);
        });

        renderInternships(filtered);
    };

    // Load Data
    allData = await fetchInternships();

    // Setup Filters
    const cities = [...new Set(allData.map(item => item.city))];
    const industries = [...new Set(allData.map(item => item.industry))];

    populateDropdown(citySelect, cities, "All Cities");
    populateDropdown(categorySelect, industries, "All Categories");

    if (citySelect) citySelect.addEventListener("change", applyFilters);
    if (typeSelect) typeSelect.addEventListener("change", applyFilters);
    if (categorySelect) categorySelect.addEventListener("change", applyFilters);

    // Initial Render
    renderInternships(allData);
};

initInternshipPage();
