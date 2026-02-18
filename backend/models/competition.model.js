import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    prize: {
        type: String,
        required: true
    },
    registrationDeadline: {
        type: Date,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ""
    },
    teamSize: {
        type: String,
        default: "1"
    },
    rules: [{
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
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

export const Competition = mongoose.model("Competition", competitionSchema);
