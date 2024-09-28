import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { string } from "zod";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear the token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Successfully logged out",
    data: null,
  });
});

// get user profile
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Access token generated successfully!",
    data: result,
  });
});
// get user profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AuthServices.getMyProfile(user);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User profile retrieved successfully",
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AuthServices.changePassword(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Password changed successfully",
    data: result,
  });
});

// forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset password link sent via your email successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

export const AuthController = {
  loginUser,
  logoutUser,
  getMyProfile,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
