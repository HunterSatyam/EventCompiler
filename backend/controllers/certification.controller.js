import { Certification } from "../models/certification.model.js";
import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Post certification
export const postCertification = async (req, res) => {
    try {
        const { title, description, provider, duration, level, fee, location, skills, companyId, companyName } = req.body;
        const userId = req.id;

        if (!title || !description || !provider || !duration || fee === undefined || (!companyId && !companyName)) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };

        const numericDuration = Number(duration);
        const numericFee = Number(fee);

        if (isNaN(numericDuration) || isNaN(numericFee)) {
            return res.status(400).json({
                message: "Duration and Fee must be valid numbers.",
                success: false
            });
        }

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

        const certification = await Certification.create({
            title,
            description,
            provider,
            duration: Number(duration),
            level: level || 'Beginner',
            fee: Number(fee),
            location: location || "Online",
            skills: skills ? skills.split(",") : [],
            company: finalCompanyId,
            created_by: userId,
            logo
        });

        await certification.populate('company');

        // Trigger notifications for matching students
        import("../utils/notificationHelper.js").then(module => {
            module.notifyMatchingStudents(certification, 'Certification');
        });


        return res.status(201).json({
            message: "New certification created successfully.",
            certification,
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

// Get all certifications
export const getAllCertifications = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { provider: { $regex: keyword, $options: "i" } },
            ]
        };

        const certifications = await Certification.find(query)
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!certifications) {
            return res.status(404).json({
                message: "Certifications not found.",
                success: false
            })
        };

        return res.status(200).json({
            certifications,
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

// Get certification by ID
export const getCertificationById = async (req, res) => {
    try {
        const certificationId = req.params.id;
        const certification = await Certification.findById(certificationId)
            .populate({ path: 'company' })
            .populate({
                path: 'enrollments',
                populate: { path: 'applicant' },
                options: { sort: { createdAt: -1 } }
            });

        if (!certification) {
            return res.status(404).json({
                message: "Certification not found.",
                success: false
            })
        };

        return res.status(200).json({ certification, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// Get admin certifications
export const getAdminCertifications = async (req, res) => {
    try {
        const adminId = req.id;
        const certifications = await Certification.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!certifications) {
            return res.status(404).json({
                message: "Certifications not found.",
                success: false
            })
        };

        return res.status(200).json({
            certifications,
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
