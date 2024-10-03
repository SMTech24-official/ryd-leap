import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createRideHistoryIntoDB = async (payload: any) => {
  const { user, ...restPayload } = payload;
  const rideHistory = await prisma.rideHistory.create({
    data: {
      ...restPayload,
      user: {
        connect: {
          id: user,
        },
      },
    },
  });

  return rideHistory;
};

const getRideHistoryIntoDB = async (userId: string) => {
  const history = await prisma.rideHistory.findMany({
    where: { userId },
  });
  if (history.length === 0) {
    throw new ApiError(404, "Ride History Not Found!");
  }

  return history;
};

export const rideHistoryServices = {
  createRideHistoryIntoDB,
  getRideHistoryIntoDB,
};
