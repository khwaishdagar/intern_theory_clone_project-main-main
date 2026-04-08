const fs = require("fs");
const path = require("path");
const LandingPage = require("../models/landingPage.model");
const Image = require("../models/image.model");
const Internship = require("../models/internship.model");
const Job = require("../models/job.model");
const OnlineCourse = require("../models/online.model");
const ClassroomCourse = require("../models/classroom.model");
const demoData = require("../data/demoData");
const logger = require("./logger");

const upsertDocument = async (Model, filter, payload) => {
  return Model.findOneAndUpdate(filter, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
};

const getScrapedData = () => {
  const rootDir = path.join(__dirname, "../../../");
  const data = {
    internships: [],
    jobs: [],
    onlineCourses: [],
    classroomCourses: [],
  };

  try {
    const intPath = path.join(rootDir, "skillindia_internships.json");
    if (fs.existsSync(intPath)) {
      const raw = JSON.parse(fs.readFileSync(intPath, "utf8"));
      const items = raw.Data?.UserProgramDetailsDTOS || [];
      data.internships = items.map((item) => ({
        img: item.InternshipPhotoUrl || "https://assets.interntheory.com/creative/logo.png",
        title: item.Name,
        name: item.ProviderName,
        time: item.Mode || "Full Time",
        industry: item.Sector || "General",
        city: "Remote",
        Stipend: item.FeeType === "Free" ? "Free" : (item.StipendAmount ? `₹${item.StipendAmount}` : "Paid"),
        weeks: item.Duration || "4-6 Weeks",
      }));
    }

    const jobPath = path.join(rootDir, "skillindia_jobs.json");
    if (fs.existsSync(jobPath)) {
      const raw = JSON.parse(fs.readFileSync(jobPath, "utf8"));
      const items = raw.Data?.Results || [];
      data.jobs = items.map((item) => ({
        img: "https://assets.interntheory.com/creative/logo.png",
        title: item.JobTitle,
        name: item.CompanyName,
        time: "Full Time",
        industry: item.IndustryName || item.SectorName || "General",
        city: item.JobLocationDistrict || item.JobLocationState || "India",
        Stipend: item.MinCtcMonthly ? `₹${item.MinCtcMonthly}/month` : "Negotiable",
        weeks: "Permanent",
      }));
    }

    const coursePath = path.join(rootDir, "skillindia_courses.json");
    if (fs.existsSync(coursePath)) {
      const raw = JSON.parse(fs.readFileSync(coursePath, "utf8"));
      const onlineItems = raw.Data?.Online?.Courses || [];
      data.onlineCourses = onlineItems.map((item) => ({
        images: item.CourseImageUrl || "https://assets.interntheory.com/creative/logo.png",
        title: item.Title || item.CourseName,
        description: item.ShortDescription || item.LongDescription || item.Title,
        Price: Number(item.Price) || 0,
        strikethrough_Price: (Number(item.Price) ? (Number(item.Price) * 1.2).toFixed(0) : "0").toString(),
        emi: "Available",
        incart: 0
      }));

      const offlineItems = raw.Data?.Offline?.Results || [];
      data.classroomCourses = offlineItems.map((item) => ({
        images: item.Thumbnail || "https://assets.interntheory.com/creative/logo.png",
        title: item.CourseName,
        description: item.Description || item.CourseName,
        Price: Number(item.Price) || 0,
        strikethrough_Price: (Number(item.Price) ? (Number(item.Price) * 1.2).toFixed(0) : "0").toString(),
        emi: "Not Available",
        incart: 0
      }));
    }
  } catch (err) {
    logger.error("Error reading scraped data files:", err.message);
  }

  return data;
};

const seedDemoData = async () => {
  const summary = {
    landingSections: 0,
    landingImages: 0,
    internships: 0,
    jobs: 0,
    onlineCourses: 0,
    classroomCourses: 0,
  };

  for (const section of demoData.landingSections) {
    await upsertDocument(
      LandingPage,
      { sectionType: section.sectionType },
      { ...section, isActive: true }
    );
    summary.landingSections += 1;
  }

  for (const image of demoData.landingImages) {
    await upsertDocument(
      Image,
      { name: image.name },
      { ...image, isActive: true }
    );
    summary.landingImages += 1;
  }

  const upsertCollection = async (Model, rows, matchKeys, counterKey) => {
    for (const row of rows) {
      const filter = matchKeys.reduce((acc, key) => {
        acc[key] = row[key];
        return acc;
      }, {});
      await upsertDocument(Model, filter, row);
      summary[counterKey] += 1;
    }
  };

  const scrapedData = getScrapedData();
  const internships = [...(scrapedData.internships || []), ...demoData.internships];
  const jobs = [...(scrapedData.jobs || []), ...demoData.jobs];
  const onlineCourses = [...(scrapedData.onlineCourses || []), ...demoData.onlineCourses];
  const classroomCourses = [...(scrapedData.classroomCourses || []), ...demoData.classroomCourses];

  await upsertCollection(Internship, internships, ["title", "name"], "internships");
  await upsertCollection(Job, jobs, ["title", "name"], "jobs");
  await upsertCollection(OnlineCourse, onlineCourses, ["title"], "onlineCourses");
  await upsertCollection(ClassroomCourse, classroomCourses, ["title"], "classroomCourses");

  logger.info("Project data synced (Scraped + Demo)", summary);
  return summary;
};

module.exports = { seedDemoData };
