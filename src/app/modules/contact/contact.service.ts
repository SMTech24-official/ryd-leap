import prisma from "../../../shared/prisma";
import { contactEmailSender } from "./contact.emailSend";

const sendEmailSupportIntoDB = async (data: any, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const htmlData = `${data.description}`;

  const result = contactEmailSender.emailSender(data, user.email, htmlData);

  return result;
};

export const contactService = {
  sendEmailSupportIntoDB,
};
