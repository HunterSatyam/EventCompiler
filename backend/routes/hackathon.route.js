import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminHackathons, getAllHackathons, getHackathonById, postHackathon } from "../controllers/hackathon.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, singleUpload, postHackathon);
router.route("/get").get(isAuthenticated, getAllHackathons);
router.route("/getadminhackathons").get(isAuthenticated, getAdminHackathons);
router.route("/get/:id").get(isAuthenticated, getHackathonById);

export default router;
