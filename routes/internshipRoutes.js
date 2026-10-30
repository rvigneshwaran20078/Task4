const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

const internships = [
  {
    id: 1,
    title: "Web Development Intern",
    company: "Tech Solutions",
    duration: "3 months",
    location: "Remote",
    description: "Build responsive websites using HTML, CSS, JavaScript and React."
  },
  {
    id: 2,
    title: "Java Developer Intern",
    company: "CodeWorks",
    duration: "2 months",
    location: "Hybrid",
    description: "Develop Java applications and practise object-oriented programming."
  },
  {
    id: 3,
    title: "Python Developer Intern",
    company: "Innovate Labs",
    duration: "3 months",
    location: "Remote",
    description: "Build Python applications and backend APIs."
  },
  {
    id: 4,
    title: "Data Analyst Intern",
    company: "Data Insights",
    duration: "2 months",
    location: "On-site",
    description: "Analyse data and create reports."
  }
];

// GET all internships
router.get("/internships", (req, res) => {
  res.json(internships);
});

// GET internship by ID
router.get("/internships/:id", (req, res) => {
  const internship = internships.find(
    item => item.id === Number(req.params.id)
  );

  if (!internship) {
    return res.status(404).json({
      message: "Internship not found"
    });
  }

  res.json(internship);
});

// POST a new application
router.post("/applications", async (req, res) => {
  try {
    const { studentName, email, rollNumber, internship } = req.body;

    if (
      typeof studentName !== "string" ||
      typeof email !== "string" ||
      typeof rollNumber !== "string" ||
      typeof internship !== "string" ||
      !studentName.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !internship.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        message: "Enter a valid email address."
      });
    }

    const application = await Application.create({
      studentName,
      email,
      rollNumber,
      internship
    });

    res.status(201).json({
      message: "Application submitted successfully!",
      application
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error(error);
    res.status(500).json({
      message: "Failed to save application."
    });
  }
});

// GET all saved applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve applications."
    });
  }
});

module.exports = router;