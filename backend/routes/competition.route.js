import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminCompetitions, getAllCompetitions, getCompetitionById, postCompetition } from "../controllers/competition.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, singleUpload, postCompetition);
router.route("/get").get(isAuthenticated, getAllCompetitions);
router.route("/getadmincompetitions").get(isAuthenticated, getAdminCompetitions);
router.route("/get/:id").get(isAuthenticated, getCompetitionById);

export default router;
