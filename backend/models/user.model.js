import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    password: {
        type: String,
    },
    googleId: {
        type: String
    },
    linkedinId: {
        type: String
    },
    githubId: {
        type: String
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    },
    savedEvents: [{
        eventType: {
            type: String,
            enum: ['Job', 'Internship', 'Hackathon', 'Competition', 'Webinar', 'Certification'],
            required: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'savedEvents.eventType'
        }
    }],
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);