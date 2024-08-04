import type { Request, Response } from "express";
import type { User } from "../domain/entity/user";
import GetMeInteractor from "../domain/getMeInteractor";
import getUserService from "../domain/getUserInteractor";
import type { HttpError } from "../interface_adapters/errors/httpError";
import { userRepository } from "../repository/userRepository";
import { addUser } from "../usecase/user/addUser";
import { getUser } from "../usecase/user/getUser";

export const userController = {
	addUser: async (req: Request, res: Response) => {
		console.info("req.body", req.body);
		const userData: Omit<User, "id"> = req.body; // リクエストボディからユーザーデータを取得

		await addUser(userData)
			.then((user) => {
				res.status(201).json(user);
			})
			.catch((e: HttpError) => {
				res.status(e.statusCode).send({ error: e.message });
			});
	},

	getUsers: async (req: Request, res: Response) => {
		try {
			const token = req.headers.authorization;
			if (!token) {
				return res.status(401).send("Unauthorized");
			}

			const authorizedUser = await userRepository.findUserByToken(token);
			if (!authorizedUser) {
				return res.status(403).send("Forbidden");
			}

			const users = await userRepository.findAllUsers();
			return res.json(users);
		} catch (e) {
			return res.status(500).send({ error: e });
		}
	},

	getUser: async (req: Request, res: Response) => {
		const id = Number(req.params.userId);
		const userService = new getUserService();

		try {
			const user = await getUser(id, userService);
			if (!user) {
				return res.status(404).send("User not found");
			}
			return res.json(user);
		} catch (error) {
			console.error("Error getting user:", error);
			return res
				.status(500)
				.send({ error: "An error occurred while getting the user." });
		}
	},

	getMe: async (req: Request, res: Response) => {
		const userId = req.body.userId;
		const password = req.body.password;
		const userService = new GetMeInteractor();

		try {
			console.info("userId", userId);
			const user = await userService.getMe(userId, password);
			if (!user) {
				return res.status(404).send("User not found");
			}
			return res.json(user);
		} catch (error) {
			console.error("Error getting user:", error);
			return res
				.status(500)
				.send({ error: "An error occurred while getting the user." });
		}
	},
};
