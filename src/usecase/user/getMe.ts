import type { User } from "@prisma/client";
import type { IGetMeService } from "../../domain/getMeInteractor";

export const getMe = async (
	userId: string,
	password: string,
	userService: IGetMeService,
): Promise<User | null> => {
	try {
		const user = await userService.getMe(userId, password);
		return user;
	} catch (error) {
		console.error("Error getting user:", error);
		return null;
	}
};
