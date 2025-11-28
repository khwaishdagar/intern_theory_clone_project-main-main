import "../layout.js";
import { initListingPage } from "./listingPage.js";

const initInternshipPage = () => {
  initListingPage({
    endpoint: "/internship",
    heading: "All Internships",
    emptyText: "No internship opportunities available right now.",
    cityResetValue: "Cities",
    typeResetValue: "Type",
  });
};

initInternshipPage();

export { initInternshipPage };

