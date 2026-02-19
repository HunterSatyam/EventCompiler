import mongoose from "mongoose";

const atsScanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume' // Optional, if linked to a Resume document
    },
    jobDescription: {
        type: String,
        required: true
    },
    resumeText: {
        type: String // Extracted text
    },
    score: {
        type: Number,
        default: 0
    },
    matchedKeywords: [{
        type: String
    }],
    missingKeywords: [{
        type: String
    }],
    suggestions: [{
        type: String
    }],
    fileName: {
        type: String
    }
}, { timestamps: true });

export const ATSScan = mongoose.model('ATSScan', atsScanSchema);
