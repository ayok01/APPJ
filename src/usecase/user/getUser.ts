import type { IGetUserService } from "../../domain/getUserInteractor";


export const getUser = async (id: number, userService: IGetUserService) => {
	try {
		const user = await userService.getUser(id);
		return user;
	} catch (error) {
		console.error("Error getting user:", error);
	}
};
