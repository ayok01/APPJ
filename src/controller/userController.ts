import type { Request, Response } from "express";
import AddUserService from "../domain/addUserInteractor";
import type { User } from "../domain/entity/user";
import { userRepository } from "../repository/userRepository";
import { addUser } from "../usecase/user/addUser";
import { getUser } from "../usecase/user/getUser";

export const userController = {
	addUser: async (req: Request, res: Response) => {
		const userData: Omit<User, "id" | "token"> = req.body; // リクエストボディからユーザーデータを取得

		const userService = new AddUserService(); // サービスのインスタンスを作成

		try {
			const user = await addUser(userData, userService); // ユースケースを呼び出す
			res.status(201).json(user);
		} catch (error) {
			console.error("Error adding user:", error);
			res
				.status(500)
				.json({ error: "An error occurred while adding the user." });
		}
	},

	getUser: async (req: Request, res: Response) => {
		try {
			const token = req.headers.authorization;
			if (!token) {
				return res.status(401).send("Unauthorized");
			}

			const authorizedUser = await userRepository.findUserByToken(token);
			if (!authorizedUser) {
				return res.status(403).send("Forbidden");
			}

			const id = Number(req.params.userId);
			if (Number.isNaN(id)) {
				return res.status(400).send("Invalid ID");
			}

			const user = await getUser(id);
			if (!user) {
				return res.status(404).send("User not found");
			}

			return res.json(user);
		} catch (e) {
			return res.status(500).send({ error: e });
		}
	},
};
