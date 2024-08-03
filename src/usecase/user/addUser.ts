import type { IUserService } from "../../domain/addUserInteractor";
import type { User } from "../../domain/entity/user";

export const addUser = async (
	userData: Omit<User, "id" | "token">,
	userService: IUserService,
) => {
	try {
		const user = await userService.addUser(userData);
		console.log("User added:", user);
	} catch (error) {
		console.error("Error adding user:", error);
	}
};
