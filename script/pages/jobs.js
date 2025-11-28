import "../layout.js";
import { initListingPage } from "./listingPage.js";

const initJobsPage = () => {
  initListingPage({
    endpoint: "/job",
    heading: "Fresher Job Jobs",
    emptyText: "No job roles match your filters yet.",
    cityResetValue: "Cities",
    typeResetValue: "Type",
  });
};

initJobsPage();

export { initJobsPage };

