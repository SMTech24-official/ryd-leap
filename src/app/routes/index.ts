import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Autrh/auth.routes";
import { SendMessageRoutes } from "../modules/otp/otp.route";
import { RiderVehicleInfoRoutes } from "../modules/riderVehicleInfo/riderVehicleInfo.route";
import { promotionsRoute } from "../modules/promotions/promotion.routes";
import { rideHistoryRoutes } from "../modules/rideHistory/rideHistory.route";
import { contactRoutes } from "../modules/contact/contact.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/otp",
    route: SendMessageRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/riderVehicleInfo",
    route: RiderVehicleInfoRoutes,
  },
  {
    path: "/promotions",
    route: promotionsRoute,
  },
  {
    path: "/ride-history",
    route: rideHistoryRoutes,
  },

  {
    path: "/contact",
    route: contactRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
