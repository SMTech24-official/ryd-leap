import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Admin, Prisma, UserRole, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import httpStatus from "http-status";

// Create a new admin in the database.
const createAdminIntoDb = async (payload: any) => {
  const isPhoneNumberExist = await prisma.oTP.findUnique({
    where: { phoneNumber: payload.phoneNumber },
  });
  if (!isPhoneNumberExist?.phoneNumber) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Phone Number is not Verified or Not exist"
    );
  }

  const existingUser = await prisma.admin.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.email}`
    );
  }

  const isUserExistWithPhoneNumber = await prisma.user.findUnique({
    where: {
      phoneNumber: payload.phoneNumber,
    },
  });

  if (isUserExistWithPhoneNumber?.phoneNumber) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.phoneNumber}`
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const userData = {
    email: payload.email,
    password: hashedPassword,
    phoneNumber: payload.phoneNumber,
    role: UserRole.ADMIN,
  };

  const { password, phoneNumber, ...adminData } = payload;

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transactionClient.admin.create({
      data: adminData,
    });

    return createdAdminData;
  });

  return result;
};

// Create a new admin in the database.
const createRiderIntoDb = async (payload: any) => {
  const isPhoneNumberExist = await prisma.oTP.findUnique({
    where: { phoneNumber: payload.phoneNumber },
  });
  if (!isPhoneNumberExist?.phoneNumber) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Phone Number is not Verified or Not exist"
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser?.email) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.email}`
    );
  }
  const isUserExistWithPhoneNumber = await prisma.user.findUnique({
    where: {
      phoneNumber: payload.phoneNumber,
    },
  });

  if (isUserExistWithPhoneNumber?.phoneNumber) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.phoneNumber}`
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const userData = {
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: hashedPassword,
    role: UserRole.RIDER,
  };

  const { password, phoneNumber, ...riderData } = payload;

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdRiderData = await transactionClient.rider.create({
      data: riderData,
    });

    return createdRiderData;
  });

  return result;
};
// Create a new admin in the database.
const createCustomerIntoDb = async (payload: any) => {
  const isPhoneNumberExist = await prisma.oTP.findUnique({
    where: { phoneNumber: payload.phoneNumber },
  });
  if (!isPhoneNumberExist?.phoneNumber) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Phone Number is not Verified or Not exist"
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.email}`
    );
  }
  const isUserExistWithPhoneNumber = await prisma.user.findUnique({
    where: {
      phoneNumber: payload.phoneNumber,
    },
  });

  if (isUserExistWithPhoneNumber?.phoneNumber) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.phoneNumber}`
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const userData = {
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: hashedPassword,
    role: UserRole.USER,
  };

  const { password, phoneNumber, ...customerData } = payload;

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdCustomerData = await transactionClient.customer.create({
      data: customerData,
    });

    return createdCustomerData;
  });

  return result;
};

// reterive all users from the database
const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: [options.sortOrder],
          }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      rider: true,
      customer: true,
      admin: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// update profile
const updateProfile = async (user: IUser, payload: IUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
      id: user.id,
    },
  });
};

const updateUserIntoDb = async (payload: IUser, id: string) => {
  // Retrieve the existing user info
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  // Update the user with the provided payload
  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      status: payload.status || userInfo.status,
      role: payload.role || userInfo.role,
      updatedAt: new Date(),
    },
  });

  return result;
};

export const userService = {
  createAdminIntoDb,
  createRiderIntoDb,
  createCustomerIntoDb,
  getUsersFromDb,
  updateProfile,
  updateUserIntoDb,
};
