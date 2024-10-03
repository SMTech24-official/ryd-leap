import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createRideHistoryIntoDB = async (rideData: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: rideData.userId,
    },
  });

  if (user?.role !== "USER") {
    throw new ApiError(
      403,
      "Access Denied: Only users can create ride request"
    );
  }

  const rideRequest = await prisma.rideHistory.create({
    data: rideData,
  });

  return rideRequest;
};

//user rider history
const getRideHistoryIntoDB = async (userId: string) => {
  const history = await prisma.rideHistory.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true,
        },
      },
    },
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
