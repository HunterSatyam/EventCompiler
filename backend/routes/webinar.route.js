import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminWebinars, getAllWebinars, getWebinarById, postWebinar } from "../controllers/webinar.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, singleUpload, postWebinar);
router.route("/get").get(isAuthenticated, getAllWebinars);
router.route("/getadminwebinars").get(isAuthenticated, getAdminWebinars);
router.route("/get/:id").get(isAuthenticated, getWebinarById);

export default router;
