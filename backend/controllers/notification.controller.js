import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            notifications,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Notification marked as read",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        await Notification.findByIdAndDelete(notificationId);
        return res.status(200).json({
            message: "Notification deleted",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
