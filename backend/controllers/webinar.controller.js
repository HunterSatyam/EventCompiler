import { Webinar } from "../models/webinar.model.js";
import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Post webinar
export const postWebinar = async (req, res) => {
    try {
        const { title, description, speaker, date, time, duration, location, meetingLink, fee, maxParticipants, companyId, companyName } = req.body;
        const userId = req.id;

        if (!title || !description || !speaker || !date || !time || !duration || (!companyId && !companyName)) {
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
                    location: location || "Online"
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

        const webinar = await Webinar.create({
            title,
            description,
            speaker,
            date: new Date(date),
            time,
            duration: Number(duration),
            location: location || "Online",
            meetingLink: meetingLink || "",
            fee: Number(fee) || 0,
            maxParticipants: Number(maxParticipants) || 100,
            company: finalCompanyId,
            created_by: userId,
            logo
        });

        await webinar.populate('company');

        // Trigger notifications for matching students
        import("../utils/notificationHelper.js").then(module => {
            module.notifyMatchingStudents(webinar, 'Webinar');
        });


        return res.status(201).json({
            message: "New webinar created successfully.",
            webinar,
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

// Get all webinars
export const getAllWebinars = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { speaker: { $regex: keyword, $options: "i" } },
            ]
        };

        const webinars = await Webinar.find(query)
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!webinars) {
            return res.status(404).json({
                message: "Webinars not found.",
                success: false
            })
        };

        return res.status(200).json({
            webinars,
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

// Get webinar by ID
export const getWebinarById = async (req, res) => {
    try {
        const webinarId = req.params.id;
        const webinar = await Webinar.findById(webinarId)
            .populate({ path: 'company' })
            .populate({
                path: 'registrations',
                populate: { path: 'applicant' },
                options: { sort: { createdAt: -1 } }
            });

        if (!webinar) {
            return res.status(404).json({
                message: "Webinar not found.",
                success: false
            })
        };

        return res.status(200).json({ webinar, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// Get admin webinars
export const getAdminWebinars = async (req, res) => {
    try {
        const adminId = req.id;
        const webinars = await Webinar.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!webinars) {
            return res.status(404).json({
                message: "Webinars not found.",
                success: false
            })
        };

        return res.status(200).json({
            webinars,
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
