import express from "express";
import { suggestApplication } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/suggest", suggestApplication);

export default router;