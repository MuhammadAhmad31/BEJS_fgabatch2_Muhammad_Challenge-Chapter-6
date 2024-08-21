import prisma from "../config/prisma.js";

export const findUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });
};

export const findRoleByName = (name) => {
  return prisma.role.findUnique({ where: { name } });
};

export const findUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });
}