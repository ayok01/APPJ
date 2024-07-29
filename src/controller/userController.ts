import express, { type Request, type Response } from "express";
import { userRepository } from "../repository/userRepository";
import { addUser } from "../usecase/user/addUser";
import { getUser } from "../usecase/user/getUser";

export const userController = {
	async addUser(req: Request, res: Response) {
		try {
			const { name, avater, introduction, password } = req.body;
			const user = await addUser({ name, avater, introduction, password });
			return res.json(user);
		} catch (e) {
			return res.status(500).send({ error: e });
		}
	},

	async getUser(req: Request, res: Response) {
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
