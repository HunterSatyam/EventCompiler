import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // Duration in weeks
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    fee: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        default: "Online"
    },
    logo: {
        type: String,
        default: ""
    },
    certificateIssued: {
        type: Boolean,
        default: true
    },
    skills: [{
        type: String
    }],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrollments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

export const Certification = mongoose.model("Certification", certificationSchema);
