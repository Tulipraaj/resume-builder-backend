const express = require("express");
const Resume = require("../models/Resume");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create-or-update", auth, async (req, res) => {
    const { userId, personalDetails, objective, skills, education, experience, projects, achievements, templates } = req.body;

    try {
        // Check if a resume already exists for this user
        let resume = await Resume.findOne({ userId });

        if (resume) {
            // Update existing resume
            resume.personalDetails = personalDetails || resume.personalDetails;
            resume.objective = objective || resume.objective;
            resume.skills = skills || resume.skills;
            resume.education = education || resume.education;
            resume.experience = experience || resume.experience;
            resume.projects = projects || resume.projects;
            resume.achievements = achievements || resume.achievements;
            resume.templates = templates || resume.templates;

            // Save the updated resume
            await resume.save();
            return res.status(200).json({ message: "Resume updated successfully", resume });
        }

        // Create a new resume if none exists
        resume = new Resume({
            userId,
            personalDetails,
            skills,
            education,
            experience,
            projects,
            achievements,
            templates,
        });

        await resume.save();
        res.status(201).json({ message: "Resume created successfully", resume });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating or updating resume" });
    }
});
  
router.get('/:userId', async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.params.userId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(resume);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching resume' });
    }
});




module.exports = router;