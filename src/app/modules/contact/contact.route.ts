import express from "express";
import { contactController } from "./contact.controller";

const router = express.Router();

router.post("/send-email/:userId", contactController.sendEmailSupport);

export const contactRoutes = router;
