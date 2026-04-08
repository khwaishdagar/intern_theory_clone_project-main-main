import "../layout.js";

let Internships_data = [];

const initInternshipPage = async () => {
    const container = document.querySelector(".internship-list");
    const citySelect = document.getElementById("city");
    const typeSelect = document.getElementById("work_type");
    const categorySelect = document.getElementById("category");

    if (!container) return;

    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Loading Internships from Skill India...</div>';

    try {
        // Fetch the scraped JSON file
        const res = await fetch('./skillindia_internships.json');
        if (res.ok) {
            const rawData = await res.json();
            const sourceItems = rawData?.Data?.UserProgramDetailsDTOS || rawData?.data?.content || [];
            
            Internships_data = sourceItems.map((item, index) => ({
                id: item.Id || index,
                title: item.Name || item.programName || "Internship Role",
                company: item.ProviderName || item.companyName || "Skill India Provider",
                logo: item.TechImgUrl || "https://assets.interntheory.com/creative/logo.png",
                category: item.Sector || item.sectorName || "Skill Training",
                city: item.Mode || item.location || "Remote/Online",
                stipend: item.StipendAmount > 0 ? `₹ ${item.StipendAmount} / month` : (item.FeeType === 'Free' ? 'Unpaid/Free' : 'Paid/Course based'),
                type: item.Duration || "Full Time",
                weeks: item.NumberOfOpenings ? `View (${item.NumberOfOpenings} Openings)` : "Apply Now",
                isCourse: false
            }));
        }
    } catch (err) {
        console.error("Error fetching Skill India data:", err);
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: red;">Failed to load data. Please ensure you are running this from a local server.</div>';
        return;
    }

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

    populateDropdown(citySelect, cities, "All Branches");
    populateDropdown(typeSelect, types, "All Durations");
    populateDropdown(categorySelect, categories, "All Sectors");

    const renderInternships = (items) => {
        container.innerHTML = "";

        // Add Heading
        const heading = document.createElement("h2");
        heading.className = "section-title";
        heading.textContent = "Skill India Internships";
        container.appendChild(heading);

        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.className = "list_empty_state";
            empty.textContent = "No internships found matching your filters.";
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
            typeBadge.textContent = "Duration: " + item.type;

            const stipendDiv = document.createElement("div");
            stipendDiv.style.marginTop = "8px";
            stipendDiv.style.fontSize = "13px";
            stipendDiv.style.fontWeight = "600";
            stipendDiv.style.color = "#495057";
            stipendDiv.textContent = item.isCourse ? "Course Content" : `${item.stipend}`;

            contentDiv.append(title, company, detailsDiv, typeBadge, stipendDiv);

            // Actions
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "card-actions";

            const statusBadge = document.createElement("span");
            statusBadge.className = "duration-badge";
            statusBadge.style.background = "#10b981";
            statusBadge.textContent = "Skill India";

            const shareIcon = document.createElement("i");
            shareIcon.className = "fi fi-sr-share share-icon";

            // Status Button
            const statusBtn = document.createElement("button");
            statusBtn.className = "apply-btn";
            statusBtn.style.cursor = "pointer";
            statusBtn.style.background = "#f0fdf4";
            statusBtn.style.color = "#16a34a";
            statusBtn.style.borderColor = "#16a34a";
            statusBtn.innerHTML = `${item.weeks.toUpperCase()}`;
            
            statusBtn.onclick = () => window.open('https://www.skillindiadigital.gov.in/', '_blank');

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

    // Attach search button listener if exists
    const searchBtn = document.querySelector(".apply-btn");
    if(searchBtn) {
        searchBtn.addEventListener("click", applyFilters);
    }
    
    if (citySelect) citySelect.addEventListener("change", applyFilters);
    if (typeSelect) typeSelect.addEventListener("change", applyFilters);
    if (categorySelect) categorySelect.addEventListener("change", applyFilters);

    // Initial Render
    renderInternships(Internships_data);
};

initInternshipPage();
