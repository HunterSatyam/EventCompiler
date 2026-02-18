import { Internship } from "../models/internship.model.js";
import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Post internship
export const postInternship = async (req, res) => {
    try {
        const { title, description, requirements, stipend, duration, location, position, companyId, companyName } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || stipend === undefined || !duration || !location || !position || (!companyId && !companyName)) {
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

        const internship = await Internship.create({
            title,
            description,
            requirements: requirements.split(","),
            stipend: Number(stipend),
            duration: Number(duration),
            location,
            position,
            company: finalCompanyId,
            created_by: userId,
            logo
        });

        await internship.populate('company');

        // Trigger notifications for matching students
        import("../utils/notificationHelper.js").then(module => {
            module.notifyMatchingStudents(internship, 'Internship');
        });


        return res.status(201).json({
            message: "New internship created successfully.",
            internship,
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

// Get all internships
export const getAllInternships = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const internships = await Internship.find(query)
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!internships) {
            return res.status(404).json({
                message: "Internships not found.",
                success: false
            })
        };

        return res.status(200).json({
            internships,
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

// Get internship by ID
export const getInternshipById = async (req, res) => {
    try {
        const internshipId = req.params.id;
        const internship = await Internship.findById(internshipId)
            .populate({ path: 'company' })
            .populate({
                path: 'applications',
                populate: { path: 'applicant' },
                options: { sort: { createdAt: -1 } }
            });

        if (!internship) {
            return res.status(404).json({
                message: "Internship not found.",
                success: false
            })
        };

        return res.status(200).json({ internship, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// Get admin internships
export const getAdminInternships = async (req, res) => {
    try {
        const adminId = req.id;
        const internships = await Internship.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!internships) {
            return res.status(404).json({
                message: "Internships not found.",
                success: false
            })
        };

        return res.status(200).json({
            internships,
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
