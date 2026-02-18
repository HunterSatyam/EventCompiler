import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

export const notifyMatchingStudents = async (event, eventType) => {
    try {
        const eventRequirements = event.requirements || [];
        const eventTitle = event.title || "";
        const eventDescription = event.description || "";

        const students = await User.find({ role: 'student' });

        const newNotifications = [];

        for (const student of students) {
            const studentSkills = student.profile?.skills || [];

            // Basic matching logic: 
            // 1. Check if any event requirement mentions a student skill
            // 2. Check if the event title or description mentions a student skill
            const isMatch = studentSkills.some(skill => {
                const lowerSkill = skill.toLowerCase();

                const matchInReqs = eventRequirements.some(req =>
                    req.toLowerCase().includes(lowerSkill) || lowerSkill.includes(req.toLowerCase())
                );

                const matchInText = eventTitle.toLowerCase().includes(lowerSkill) ||
                    eventDescription.toLowerCase().includes(lowerSkill);

                return matchInReqs || matchInText;
            });

            if (isMatch || studentSkills.length === 0) {
                newNotifications.push({
                    userId: student._id,
                    title: `New ${eventType} Alert!`,
                    message: `"${event.title}" has been posted. Don't miss out!`,
                    type: eventType,
                    eventId: event._id
                });
            }
        }

        if (newNotifications.length > 0) {
            await Notification.insertMany(newNotifications);
        }
    } catch (error) {
        console.error("Error sending notifications:", error);
    }
}

