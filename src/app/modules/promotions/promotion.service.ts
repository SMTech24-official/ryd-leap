import { PrismaClient } from "@prisma/client";
import ApiError from "../../errors/ApiErrors";

const prisma = new PrismaClient();

const createPromotionsIntoDB = async (payload: any) => {
  const promotion = await prisma.offer.create({
    data: payload,
  });
  return promotion;
};

const getPromotionsOfferIntoDB = async () => {
  const promotions = await prisma.offer.findMany();
  if (!promotions) {
    throw new ApiError(404, "promotions not found!");
  }
  return promotions;
};

export const promotionsServices = {
  createPromotionsIntoDB,
  getPromotionsOfferIntoDB,
};
