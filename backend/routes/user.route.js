import express from "express";
import { login, logout, register, updateProfile, socialLogin, getMyProfile } from "../controllers/user.controller.js";
import passport from "passport";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updateProfile);

// Social Login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }), socialLogin);

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/auth/github/callback", passport.authenticate("github", { session: false, failureRedirect: "http://localhost:5173/login" }), socialLogin);

router.get("/auth/linkedin", passport.authenticate("linkedin", { state: true }));
router.get("/auth/linkedin/callback", passport.authenticate("linkedin", { session: false, failureRedirect: "http://localhost:5173/login" }), socialLogin);

// Get Profile
router.route("/me").get(isAuthenticated, getMyProfile);

export default router;
