import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'My Resume'
    },
    personalInfo: {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        phone: { type: String },
        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String },
        summary: { type: String }
    },
    education: [{
        institution: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String }
    }],
    experience: [{
        company: { type: String },
        role: { type: String },
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String }
    }],
    projects: [{
        title: { type: String },
        description: { type: String },
        technologies: [{ type: String }],
        link: { type: String }
    }],
    skills: [{ type: String }],
    certifications: [{
        name: { type: String },
        issuer: { type: String },
        date: { type: Date },
        link: { type: String }
    }],
    templateId: {
        type: String,
        default: 'modern'
    }
}, { timestamps: true });

export const Resume = mongoose.model('Resume', resumeSchema);
