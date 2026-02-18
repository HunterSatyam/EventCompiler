import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminCertifications, getAllCertifications, getCertificationById, postCertification } from "../controllers/certification.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, singleUpload, postCertification);
router.route("/get").get(isAuthenticated, getAllCertifications);
router.route("/getadmincertifications").get(isAuthenticated, getAdminCertifications);
router.route("/get/:id").get(isAuthenticated, getCertificationById);

export default router;
