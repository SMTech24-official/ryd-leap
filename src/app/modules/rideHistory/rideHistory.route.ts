import express from "express";
import { rideHistoryController } from "./rideHistory.controller";

const router = express.Router();

router.post("/create/:userId", rideHistoryController.createRideHistory);
router.get("/:userId", rideHistoryController.getRideHistory);

export const rideHistoryRoutes = router;
