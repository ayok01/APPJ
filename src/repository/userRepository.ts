import { PrismaClient } from "@prisma/client";
import type { User } from "../domain/entity/user";

const prisma = new PrismaClient();

export const userRepository = {
    async findUserById(id: number): Promise<User | null> {
		console.info("id", id);
        return await prisma.user.findFirst({ where: { id } });
    },

	async createUser(data: Omit<User, "id">): Promise<User> {
		return await prisma.user.create({ data });
	},

	async findUserByToken(token: string): Promise<User | null> {
		return await prisma.user.findFirst({ where: { token } });
	},

	// ユーザーIdとパスワードからユーザーを取得する
	async findUserByNameAndPassword(userId: string, password: string): Promise<User | null> {
		if (!userId || !password) {
			return null;
		}
		return await prisma.user.findFirst({ where: { userId, password } });
	},
	// ユーザーIDからユーザーを取得する
	async findUserByUserId(userId: string): Promise<User | null> {
		return await prisma.user.findFirst({ where: { userId } });
	},

	async findAllUsers(): Promise<User[]> {
		return await prisma.user.findMany();
	},
};
