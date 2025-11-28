const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String },
    category: { 
      type: String, 
      enum: ["hero", "feature", "testimonial", "logo", "icon", "banner", "other"],
      default: "other"
    },
    page: {
      type: String,
      enum: ["landing", "register", "login", "internship", "jobs", "courses", "other"],
      default: "other"
    },
    isActive: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("image", imageSchema);

