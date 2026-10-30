const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true
    },
    internship: {
      type: String,
      required: true,
      enum: [
        "Web Development Intern",
        "Java Developer Intern",
        "Python Developer Intern",
        "Data Analyst Intern"
      ]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);