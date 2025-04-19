import express from "express";
// Ensure the file extension is included
import db from "../db.js";
const router = express.Router();

// Add Job Listing
router.post("/add", async (req, res) => {
  const { title, description, company, location, salary, recruiterId } =
    req.body;
  try {
    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      recruiterId,
    });
    await job.save();
    res.status(201).json({ message: "Job listing added successfully", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Job Listings
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
