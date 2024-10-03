import express from "express";
import { contactController } from "./contact.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/send-email", auth(), contactController.sendEmailSupport);

export const contactRoutes = router;
