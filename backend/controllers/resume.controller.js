import { Resume } from "../models/resume.model.js";

export const createResume = async (req, res) => {
    try {
        const { title, personalInfo, education, experience, projects, skills, certifications } = req.body;
        const userId = req.id;

        if (!title || !personalInfo) {
            return res.status(400).json({
                message: "Title and Personal Info differ required.",
                success: false
            });
        }

        const newResume = await Resume.create({
            userId,
            title,
            personalInfo,
            education,
            experience,
            projects,
            skills,
            certifications
        });

        return res.status(201).json({
            message: "Resume created successfully.",
            success: true,
            resume: newResume
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error creating resume.",
            success: false
        });
    }
};

export const getMyResumes = async (req, res) => {
    try {
        const userId = req.id;
        const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            resumes
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error fetching resumes.",
            success: false
        });
    }
};

export const getResumeById = async (req, res) => {
    try {
        const resumeId = req.params.id;
        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            resume
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error fetching resume.",
            success: false
        });
    }
};

export const updateResume = async (req, res) => {
    try {
        const resumeId = req.params.id;
        const updateData = req.body;

        const updatedResume = await Resume.findByIdAndUpdate(resumeId, updateData, { new: true });

        if (!updatedResume) {
            return res.status(404).json({
                message: "Resume not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Resume updated successfully.",
            success: true,
            resume: updatedResume
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error updating resume.",
            success: false
        });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const resumeId = req.params.id;
        await Resume.findByIdAndDelete(resumeId);
        return res.status(200).json({
            message: "Resume deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error deleting resume.",
            success: false
        });
    }
};
