import { Competition } from "../models/competition.model.js";
import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Post competition
export const postCompetition = async (req, res) => {
    try {
        const { title, description, category, prize, registrationDeadline, eventDate, location, teamSize, rules, companyId, companyName } = req.body;
        const userId = req.id;

        if (!title || !description || !category || !prize || !registrationDeadline || !eventDate || !location || (!companyId && !companyName)) {
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

        const competition = await Competition.create({
            title,
            description,
            category,
            prize,
            registrationDeadline: new Date(registrationDeadline),
            eventDate: new Date(eventDate),
            location,
            teamSize: teamSize || 1,
            rules: rules ? rules.split(",") : [],
            company: finalCompanyId,
            created_by: userId,
            logo
        });

        await competition.populate('company');

        // Trigger notifications for matching students
        import("../utils/notificationHelper.js").then(module => {
            module.notifyMatchingStudents(competition, 'Competition');
        });


        return res.status(201).json({
            message: "New competition created successfully.",
            competition,
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

// Get all competitions
export const getAllCompetitions = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
            ]
        };

        const competitions = await Competition.find(query)
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!competitions) {
            return res.status(404).json({
                message: "Competitions not found.",
                success: false
            })
        };

        return res.status(200).json({
            competitions,
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

// Get competition by ID
export const getCompetitionById = async (req, res) => {
    try {
        const competitionId = req.params.id;
        const competition = await Competition.findById(competitionId)
            .populate({ path: 'company' })
            .populate({
                path: 'participants',
                populate: { path: 'applicant' },
                options: { sort: { createdAt: -1 } }
            });

        if (!competition) {
            return res.status(404).json({
                message: "Competition not found.",
                success: false
            })
        };

        return res.status(200).json({ competition, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// Get admin competitions
export const getAdminCompetitions = async (req, res) => {
    try {
        const adminId = req.id;
        const competitions = await Competition.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!competitions) {
            return res.status(404).json({
                message: "Competitions not found.",
                success: false
            })
        };

        return res.status(200).json({
            competitions,
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
