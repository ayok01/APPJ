import { PrismaClient } from "@prisma/client";
import type { User } from "../domain/entity/user";

const prisma = new PrismaClient();

export const userRepository = {
	async findUserById(id: number): Promise<User | null> {
		return await prisma.user.findFirst({ where: { id } });
	},

	async createUser(data: Omit<User, "id">): Promise<User> {
		return await prisma.user.create({ data });
	},

	async findUserByToken(token: string): Promise<User | null> {
		return await prisma.user.findFirst({ where: { token } });
	},
};
