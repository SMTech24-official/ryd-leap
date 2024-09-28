import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// create admin
router.post(
  "/create-admin",
  validateRequest(UserValidation.CreateAdminValidationSchema),
  userController.createAdmin
);

// create rider
router.post(
  "/create-rider",
  validateRequest(UserValidation.CreateAdminValidationSchema),
  userController.createRider
);
// create customer
router.post(
  "/create-customer",
  validateRequest(UserValidation.CreateAdminValidationSchema),
  userController.createCustomer
);
// *!get all  user
router.get("/", userController.getUsers);

// *!profile user
router.put(
  "/profile",
  validateRequest(UserValidation.userUpdateSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  userController.updateProfile
);

// *!update  user
router.put("/:id", auth(UserRole.ADMIN), userController.updateUser);

export const userRoutes = router;
