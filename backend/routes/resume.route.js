import express from "express";
import { createResume, getMyResumes, getResumeById, updateResume, deleteResume } from "../controllers/resume.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createResume);
router.get("/my", isAuthenticated, getMyResumes);
router.get("/:id", isAuthenticated, getResumeById);
router.put("/update/:id", isAuthenticated, updateResume);
router.delete("/delete/:id", isAuthenticated, deleteResume);

export default router;
