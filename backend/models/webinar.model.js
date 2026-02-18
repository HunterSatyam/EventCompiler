import mongoose from "mongoose";

const webinarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    speaker: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // Duration in hours
        required: true
    },
    location: {
        type: String,
        default: "Online"
    },
    meetingLink: {
        type: String,
        default: ""
    },
    logo: {
        type: String,
        default: ""
    },
    fee: {
        type: Number,
        default: 0 // 0 means free
    },
    maxParticipants: {
        type: Number,
        default: 100
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
    registrations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

export const Webinar = mongoose.model("Webinar", webinarSchema);
