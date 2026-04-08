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
            empty.style.gridColumn = "1 / -1";
            empty.style.textAlign = "center";
            empty.style.padding = "40px";
            container.appendChild(empty);
            return;
        }

        items.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "internship-card";
            card.style.animationDelay = `${index * 0.05}s`;

            const logoDiv = document.createElement("div");
            logoDiv.className = "card-logo";
            const img = document.createElement("img");
            img.src = item.img || "https://assets.interntheory.com/creative/logo.png";
            img.alt = item.name;
            img.onerror = function () { this.src = 'https://assets.interntheory.com/creative/logo.png'; };
            logoDiv.appendChild(img);

            const contentDiv = document.createElement("div");
            contentDiv.className = "card-content";

            const title = document.createElement("h3");
            title.className = "card-title";
            title.textContent = item.title;

            const company = document.createElement("p");
            company.className = "card-company";
            company.textContent = item.name;

            const detailsDiv = document.createElement("div");
            detailsDiv.className = "card-details";

            const industryBadge = document.createElement("span");
            industryBadge.className = "detail-item";
            industryBadge.innerHTML = `<i class="fas fa-briefcase"></i> ${item.industry || "General"}`;

            const cityBadge = document.createElement("span");
            cityBadge.className = "detail-item";
            cityBadge.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.city || "Remote"}`;

            detailsDiv.append(industryBadge, cityBadge);

            const stipendDiv = document.createElement("div");
            stipendDiv.className = "detail-item";
            stipendDiv.style.marginTop = "8px";
            stipendDiv.style.fontWeight = "600";
            stipendDiv.innerHTML = `<i class="fas fa-money-bill-wave"></i> Stipend: ${item.Stipend || "Paid"}`;

            contentDiv.append(title, company, detailsDiv, stipendDiv);

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
            applyBtn.textContent = "VIEW AND APPLY";

            actionsDiv.append(durationBadge, shareIcon, applyBtn);

            card.append(logoDiv, contentDiv, actionsDiv);
            container.appendChild(card);
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
