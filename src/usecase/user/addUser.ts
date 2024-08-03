import type { User } from "../../domain/entity/user";
import CheckUserIdService from "../../domain/checkUserIdInteractor";
import AddUserService from "../../domain/addUserInteractor";
import { HttpError } from "../../interface_adapters/errors/httpError";

export const addUser = async (
	userData: Omit<User, "id">,
) => {
	const checkUserIdService = new CheckUserIdService();
	const isExist = await checkUserIdService.checkUserId(userData.userId);
	if (isExist) {
		throw new HttpError("The user ID already exists.", 409);
	}
	
	try {
		const userService = new AddUserService(); 
		const user = await userService.addUser(userData);
		return user;
	} catch (error) {
		throw new HttpError("An error occurred while adding the user.", 500);
	}
};
