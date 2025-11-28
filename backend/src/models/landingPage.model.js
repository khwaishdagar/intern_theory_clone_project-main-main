const mongoose = require("mongoose");

const landingPageSchema = new mongoose.Schema(
  {
    sectionType: { 
      type: String, 
      required: true,
      enum: ["hero", "eligibility", "benefits", "political_figures", "features", "opportunities", "carousel"]
    },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    content: { type: mongoose.Schema.Types.Mixed }, // For flexible content structure
    order: { type: Number, default: 0 }, // For ordering sections
    isActive: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("landingPage", landingPageSchema);

