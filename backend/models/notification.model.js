import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Job', 'Internship', 'Hackathon', 'Competition', 'Webinar', 'Certification'],
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
