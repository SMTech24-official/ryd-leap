import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { rideHistoryServices } from "./rideHistory.service";

const createRideHistory = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const rideData = { ...req.body, user: userId };

  const result = await rideHistoryServices.createRideHistoryIntoDB(rideData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Ride History Created Successfully",
    data: result,
  });
});

const getRideHistory = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await rideHistoryServices.getRideHistoryIntoDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride History Return Successfully",
    data: result,
  });
});

export const rideHistoryController = {
  createRideHistory,
  getRideHistory,
};
