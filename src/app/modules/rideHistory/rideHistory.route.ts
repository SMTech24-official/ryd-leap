import express from "express";
import { rideHistoryController } from "./rideHistory.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create/", auth(), rideHistoryController.createRideHistory);
router.get("/", auth(), rideHistoryController.getRideHistory);

export const rideHistoryRoutes = router;
