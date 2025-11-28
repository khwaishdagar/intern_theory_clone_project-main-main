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

  await upsertCollection(Internship, demoData.internships, ["title", "city"], "internships");
  await upsertCollection(Job, demoData.jobs, ["title", "city"], "jobs");
  await upsertCollection(
    OnlineCourse,
    demoData.onlineCourses,
    ["title"],
    "onlineCourses"
  );
  await upsertCollection(
    ClassroomCourse,
    demoData.classroomCourses,
    ["title"],
    "classroomCourses"
  );

  logger.info("Demo content synced", summary);
  return summary;
};

module.exports = { seedDemoData };

