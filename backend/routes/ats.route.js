import express from "express";
import multer from "multer";
import { checkATSScore, getMyScans } from "../controllers/ats.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" }); // Configure destination for temporary files

router.post("/check", isAuthenticated, upload.single("resume"), checkATSScore);
router.get("/my", isAuthenticated, getMyScans);

export default router;
