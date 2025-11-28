const express = require("express");
const LandingPage = require("../models/landingPage.model");
const Image = require("../models/image.model");

const router = express.Router();

// Get all landing page sections
router.get("/sections", async (req, res) => {
  try {
    const sections = await LandingPage.find({ isActive: true })
      .sort({ order: 1 })
      .lean()
      .exec();
    return res.status(200).json(sections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get section by type
router.get("/sections/:type", async (req, res) => {
  try {
    const section = await LandingPage.findOne({ 
      sectionType: req.params.type,
      isActive: true 
    }).lean().exec();
    
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    
    return res.status(200).json(section);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Create/Update landing page section
router.post("/sections", async (req, res) => {
  try {
    const { sectionType, ...data } = req.body;
    
    const section = await LandingPage.findOneAndUpdate(
      { sectionType },
      { sectionType, ...data, isActive: true },
      { upsert: true, new: true }
    );
    
    return res.status(201).json(section);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get images by category or page
router.get("/images", async (req, res) => {
  try {
    const { category, page } = req.query;
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (page) query.page = page;
    
    const images = await Image.find(query).lean().exec();
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Upload/Create image
router.post("/images", async (req, res) => {
  try {
    const image = await Image.create(req.body);
    return res.status(201).json(image);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get complete landing page data
router.get("/", async (req, res) => {
  try {
    const sections = await LandingPage.find({ isActive: true })
      .sort({ order: 1 })
      .lean()
      .exec();
    
    const images = await Image.find({ 
      isActive: true,
      page: "landing"
    }).lean().exec();
    
    return res.status(200).json({
      sections,
      images
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

