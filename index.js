require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const internshipRoutes = require("./routes/internshipRoutes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Student Internship Portal API is running"
  });
});

app.use("/api", internshipRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();