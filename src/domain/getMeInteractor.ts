import type { User } from "@prisma/client";
import { userRepository } from "../repository/userRepository";

/**
 * ユーザーIdとパスワードからユーザーを取得する
 */
export type IGetMeService = {
	getMe(userId: string, password: string): Promise<User | null>;
};

class GetMeInteractor implements IGetMeService {
	public async getMe(userId: string, password: string): Promise<User | null> {
		try {
			console.info("userId", userId);
			const user = await userRepository.findUserByNameAndPassword(
				userId,
				password,
			);
			console.info("user", user);
			if (!user) {
				return null;
			}
			return user;
		} catch (error) {
			console.error("Error getting user:", error);
			return null;
		}
	}
}

export default GetMeInteractor;
