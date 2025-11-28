import { buildBackendUrl } from "../api.js";

const defaultConfig = {
  endpoint: "/job",
  heading: "Listings",
  containerId: "all_intership",
  citySelector: "#city",
  typeSelector: "#work_type",
  emptyText: "No opportunities found for the selected filters.",
  cityResetValue: "Cities",
  typeResetValue: "Type",
  cityEndpoint: (endpoint, value) => `${endpoint}/${encodeURIComponent(value)}`,
  typeEndpoint: (endpoint, value) =>
    `${endpoint}/user/${encodeURIComponent(value)}`,
};

const createShareIcon = () => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<i style="font-size: large;" class="fi fi-sr-share"></i>`;
  return wrapper.firstChild;
};

const createListingCard = (item) => {
  const card = document.createElement("div");
  card.id = "intership_programs";

  const logoWrapper = document.createElement("div");
  logoWrapper.id = "imd-div";
  const logo = document.createElement("img");
  logo.src = item.img;
  logo.alt = item.name;
  logoWrapper.appendChild(logo);

  const content = document.createElement("div");
  content.id = "content";
  const title = document.createElement("h3");
  title.textContent = item.title;
  const company = document.createElement("p");
  company.textContent = item.name;
  const industry = document.createElement("p");
  industry.textContent = item.industry;
  const city = document.createElement("p");
  city.textContent = item.city;
  const stipend = document.createElement("p");
  stipend.textContent = item.Stipend;
  content.append(title, company, industry, city, stipend);

  const cta = document.createElement("div");
  cta.id = "view_apply";
  const duration = document.createElement("p");
  duration.textContent = item.weeks;
  const shareBtn = createShareIcon();
  const viewLink = document.createElement("a");
  viewLink.className = "view_apply_link";
  viewLink.href = "register.html";
  viewLink.dataset.route = "register";
  viewLink.textContent = "VIEW AND APPLY";
  cta.append(duration, shareBtn, viewLink);

  card.append(logoWrapper, content, cta);
  return card;
};

const initListingPage = (config = {}) => {
  const settings = { ...defaultConfig, ...config };
  const container = document.getElementById(settings.containerId);
  if (!container) return;

  const state = {
    items: [],
  };

  const renderHeading = () => {
    const heading = document.createElement("h2");
    heading.textContent = settings.heading;
    return heading;
  };

  const renderMessage = (text) => {
    container.innerHTML = "";
    container.appendChild(renderHeading());
    const message = document.createElement("p");
    message.className = "list_empty_state";
    message.textContent = text;
    container.appendChild(message);
  };

  const renderListings = (items) => {
    container.innerHTML = "";
    container.appendChild(renderHeading());

    if (!items || !items.length) {
      renderMessage(settings.emptyText);
      return;
    }

    items.forEach((item) => {
      container.appendChild(createListingCard(item));
    });
  };

  const fetchData = async (path) => {
    const response = await fetch(buildBackendUrl(path));
    if (!response.ok) {
      throw new Error("Failed to fetch listings");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const loadInitial = async () => {
    try {
      const data = await fetchData(settings.endpoint);
      state.items = data;
      renderListings(data);
    } catch (error) {
      console.error(error);
      renderMessage("Unable to load listings. Please try again in a bit.");
    }
  };

  const handleCityChange = async (event) => {
    const value = event.target.value;
    if (!value || value === settings.cityResetValue) {
      renderListings(state.items);
      return;
    }
    try {
      const data = await fetchData(
        settings.cityEndpoint(settings.endpoint, value)
      );
      renderListings(data);
    } catch (error) {
      console.error(error);
      renderMessage("Could not filter by city right now.");
    }
  };

  const handleTypeChange = async (event) => {
    const value = event.target.value;
    if (!value || value === settings.typeResetValue) {
      renderListings(state.items);
      return;
    }
    try {
      const data = await fetchData(
        settings.typeEndpoint(settings.endpoint, value)
      );
      renderListings(data);
    } catch (error) {
      console.error(error);
      renderMessage("Could not filter by type right now.");
    }
  };

  const citySelect = document.querySelector(settings.citySelector);
  if (citySelect) {
    citySelect.addEventListener("change", handleCityChange);
  }

  const typeSelect = document.querySelector(settings.typeSelector);
  if (typeSelect) {
    typeSelect.addEventListener("change", handleTypeChange);
  }

  loadInitial();
};

export { initListingPage };

