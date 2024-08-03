import { userRepository } from "../repository/userRepository";
import type { User } from "./entity/user";

export interface IUserService {
	addUser(data: Omit<User, "id" | "token">): Promise<User>;
}

class AddUserService implements IUserService {
	private _LENGTH = 24;
	private _SOURCE = "abcdefghijklmnopqrstuvwxyz0123456789";

	// セッションIDを生成するメソッド
	private generateSessionId(): string {
		let result = "";
		for (let i = 0; i < this._LENGTH; i++) {
			result += this._SOURCE[Math.floor(Math.random() * this._SOURCE.length)];
		}
		return result;
	}

	// ユーザーを追加するメソッド
	public async addUser(data: Omit<User, "id" | "token">): Promise<User> {
		const token = this.generateSessionId();
		return await userRepository.createUser({ ...data, token });
	}
}

export default AddUserService;
