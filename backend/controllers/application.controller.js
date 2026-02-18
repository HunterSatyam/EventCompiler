import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Internship } from "../models/internship.model.js";
import { Hackathon } from "../models/hackathon.model.js";
import { Webinar } from "../models/webinar.model.js";
import { Competition } from "../models/competition.model.js";
import { Certification } from "../models/certification.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id; // This is the entity ID (Job, Internship, etc.)
        const type = req.query.type || 'job'; // Default to 'job' if not provided

        if (!jobId) {
            return res.status(400).json({
                message: "ID is required.",
                success: false
            })
        };

        // Determine the model based on type
        let Model;
        let modelName;

        switch (type.toLowerCase()) {
            case 'job':
                Model = Job;
                modelName = 'Job';
                break;
            case 'internship':
                Model = Internship;
                modelName = 'Internship';
                break;
            case 'hackathon':
                Model = Hackathon;
                modelName = 'Hackathon';
                break;
            case 'webinar':
                Model = Webinar;
                modelName = 'Webinar';
                break;
            case 'competition':
                Model = Competition;
                modelName = 'Competition';
                break;
            case 'certification':
                Model = Certification;
                modelName = 'Certification';
                break;
            default:
                return res.status(400).json({
                    message: "Invalid application type.",
                    success: false
                });
        }

        // check if the user has already applied for the entity
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: `You have already applied for this ${modelName.toLowerCase()}`,
                success: false
            });
        }

        // check if the entity exists
        const entity = await Model.findById(jobId);
        if (!entity) {
            return res.status(404).json({
                message: `${modelName} not found`,
                success: false
            })
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            applicationType: modelName,
            status: 'pending'
        });

        // Add application to the entity's specific array
        if (modelName === 'Webinar') {
            entity.registrations.push(newApplication._id);
        } else if (modelName === 'Competition') {
            entity.participants.push(newApplication._id);
        } else if (modelName === 'Certification') {
            entity.enrollments.push(newApplication._id);
        } else {
            // Job, Internship, Hackathon use 'applications'
            if (entity.applications) {
                entity.applications.push(newApplication._id);
            }
        }
        await entity.save();

        return res.status(201).json({
            message: "Applied successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
};
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        };
        return res.status(200).json({
            job,
            succees: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: 'status is required',
                success: false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

// Get all applications for recruiter's jobs
export const getRecruiterApplications = async (req, res) => {
    try {
        const recruiterId = req.id;

        // Find all jobs posted by this recruiter
        const jobs = await Job.find({ created_by: recruiterId })
            .populate({
                path: 'applications',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'applicant',
                    select: 'fullname email phoneNumber profile'
                }
            })
            .sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: 'No jobs found',
                success: false
            });
        }

        // Flatten all applications from all jobs
        const allApplications = jobs.reduce((acc, job) => {
            const jobApplications = job.applications.map(app => ({
                ...app.toObject(),
                jobTitle: job.title,
                jobType: job.jobType,
                jobId: job._id
            }));
            return [...acc, ...jobApplications];
        }, []);

        return res.status(200).json({
            applications: allApplications,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
}