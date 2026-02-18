import { Hackathon } from "../models/hackathon.model.js";
import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Post hackathon
export const postHackathon = async (req, res) => {
    try {
        const { title, description, requirements, prize, date, location, teamSize, companyId, companyName } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !prize || !date || !location || (!companyId && !companyName)) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };

        let finalCompanyId = companyId;

        if (!finalCompanyId && companyName) {
            let company = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, 'i') } });
            if (!company) {
                company = await Company.create({
                    name: companyName,
                    userId: userId,
                    location: location || "Unknown"
                });
            }
            finalCompanyId = company._id;
        }

        if (finalCompanyId) {
            const companyExists = await Company.findById(finalCompanyId);
            if (!companyExists) {
                return res.status(400).json({
                    message: "Referenced company not found.",
                    success: false
                });
            }
        }

        let logo = "";
        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logo = cloudResponse.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed. Proceeding without logo.", error);
            }
        }

        const hackathon = await Hackathon.create({
            title,
            description,
            requirements: requirements.split(","),
            prize,
            date: new Date(date),
            location,
            teamSize: teamSize || 1,
            company: finalCompanyId,
            created_by: userId,
            logo
        });

        await hackathon.populate('company');

        // Trigger notifications for matching students
        import("../utils/notificationHelper.js").then(module => {
            module.notifyMatchingStudents(hackathon, 'Hackathon');
        });


        return res.status(201).json({
            message: "New hackathon created successfully.",
            hackathon,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// Get all hackathons
export const getAllHackathons = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const hackathons = await Hackathon.find(query)
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!hackathons) {
            return res.status(404).json({
                message: "Hackathons not found.",
                success: false
            })
        };

        return res.status(200).json({
            hackathons,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// Get hackathon by ID
export const getHackathonById = async (req, res) => {
    try {
        const hackathonId = req.params.id;
        const hackathon = await Hackathon.findById(hackathonId)
            .populate({ path: 'company' })
            .populate({
                path: 'applications',
                populate: { path: 'applicant' },
                options: { sort: { createdAt: -1 } }
            });

        if (!hackathon) {
            return res.status(404).json({
                message: "Hackathon not found.",
                success: false
            })
        };

        return res.status(200).json({ hackathon, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// Get admin hackathons
export const getAdminHackathons = async (req, res) => {
    try {
        const adminId = req.id;
        const hackathons = await Hackathon.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!hackathons) {
            return res.status(404).json({
                message: "Hackathons not found.",
                success: false
            })
        };

        return res.status(200).json({
            hackathons,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}
