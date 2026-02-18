import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    stipend: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // Duration in months
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ""
    },
    position: {
        type: Number,
        required: true
    },
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
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

export const Internship = mongoose.model("Internship", internshipSchema);
