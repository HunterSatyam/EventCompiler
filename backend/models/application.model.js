import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'applicationType'
    },
    applicationType: {
        type: String,
        required: true,
        enum: ['Job', 'Internship', 'Hackathon', 'Webinar', 'Competition', 'Certification'],
        default: 'Job'
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });
export const Application = mongoose.model("Application", applicationSchema);