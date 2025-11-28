const express = require("express");
const { seedDemoData } = require("../utils/demoSeeder");

const router = express.Router();

router.post("/seed", async (req, res) => {
  try {
    const summary = await seedDemoData();
    return res.status(200).json({
      message: "Demo data seeded successfully",
      summary,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

