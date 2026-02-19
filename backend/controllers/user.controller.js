import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        let cloudResponse = null;

        // Check if Cloudinary is configured
        const isCloudinaryConfigured = process.env.CLOUD_NAME !== 'your_cloud_name' && process.env.API_KEY !== 'your_api_key';

        if (file) {
            if (isCloudinaryConfigured) {
                try {
                    const fileUri = getDataUri(file);
                    cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                } catch (error) {
                    console.log("Cloudinary upload failed, falling back to local:", error);
                    // Fallback logic handled below
                }
            }

            // Fallback if Cloudinary failed or wasn't configured
            if (!cloudResponse) {
                try {
                    const fileName = `profile-${Date.now()}-${file.originalname}`;
                    const uploadsDir = path.resolve("public/uploads");
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    const filePath = path.join(uploadsDir, fileName);
                    fs.writeFileSync(filePath, file.buffer);
                    cloudResponse = { secure_url: `${req.protocol}://${req.get('host')}/uploads/${fileName}` };
                } catch (localError) {
                    console.error("Local file save failed:", localError);
                    // Proceed without profile photo or handle critical error
                }
            }
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse ? cloudResponse.secure_url : "",
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
            error: error.message,
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        // Check for req.files instead of req.file
        // 'file' is the key for resume, 'profilePhoto' is for the image
        const file = req.files?.['file'] ? req.files['file'][0] : null;
        const profilePhoto = req.files?.['profilePhoto'] ? req.files['profilePhoto'][0] : null;

        // Upload Resume if present
        let cloudResponseResume = null;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                cloudResponseResume = await cloudinary.uploader.upload(fileUri.content);
            } catch (error) {
                console.log("Cloudinary upload (resume) failed:", error);
                const fileName = `resume-${Date.now()}-${file.originalname}`;
                const filePath = path.resolve("public/uploads", fileName);
                try {
                    fs.writeFileSync(filePath, file.buffer);
                    cloudResponseResume = { secure_url: `${req.protocol}://${req.get('host')}/uploads/${fileName}` };
                } catch (err) { console.error("Local save failed", err) }
            }
        }

        // Upload Profile Photo if present
        let cloudResponsePhoto = null;
        if (profilePhoto) {
            try {
                const fileUri = getDataUri(profilePhoto);
                // Upload image, maybe with specific transformation if needed
                cloudResponsePhoto = await cloudinary.uploader.upload(fileUri.content);
            } catch (error) {
                console.log("Cloudinary upload (photo) failed:", error);
                const fileName = `photo-${Date.now()}-${profilePhoto.originalname}`;
                const filePath = path.resolve("public/uploads", fileName);
                try {
                    fs.writeFileSync(filePath, profilePhoto.buffer);
                    cloudResponsePhoto = { secure_url: `${req.protocol}://${req.get('host')}/uploads/${fileName}` };
                } catch (err) { console.error("Local save failed", err) }
            }
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // Update resume info
        if (cloudResponseResume) {
            user.profile.resume = cloudResponseResume.secure_url;
            if (file && file.originalname) user.profile.resumeOriginalName = file.originalname;
        }

        // Update profile photo info
        if (cloudResponsePhoto) {
            user.profile.profilePhoto = cloudResponsePhoto.secure_url;
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const socialLogin = async (req, res) => {
    try {
        const user = req.user;
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' })
            .redirect("http://localhost:5173/");

    } catch (error) {
        console.log(error);
        return res.redirect("http://localhost:5173/login");
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            })
        };
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

// Toggle save event
export const toggleSavedEvent = async (req, res) => {
    try {
        const userId = req.id;
        const { eventType, eventId } = req.body;

        if (!eventType || !eventId) {
            return res.status(400).json({
                message: "Event type and ID are required.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if event is already saved
        const isSavedIndex = user.savedEvents.findIndex(
            item => item.eventId.toString() === eventId && item.eventType === eventType
        );

        if (isSavedIndex > -1) {
            // Unsave
            user.savedEvents.splice(isSavedIndex, 1);
            await user.save();
            return res.status(200).json({
                message: "Event removed from saved list.",
                success: true,
                isSaved: false
            });
        } else {
            // Save
            user.savedEvents.push({ eventType, eventId });
            await user.save();
            return res.status(200).json({
                message: "Event saved successfully.",
                success: true,
                isSaved: true
            });
        }
    } catch (error) {
        console.error("Toggle Saved Event Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get saved events
export const getSavedEvents = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: 'savedEvents.eventId',
            select: 'title company location salary stipend prize date logo description jobType createdAt position experienceLevel duration experience',
            populate: { path: 'company' }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        return res.status(200).json({
            savedEvents: user.savedEvents,
            success: true
        });
    } catch (error) {
        console.error("Get Saved Events Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};