import { userRepository } from "../repository/userRepository";
import {  UserWithoutSensitiveInfo } from "./entity/user";

export interface IGetUserService {
    getUser(id: number): Promise<UserWithoutSensitiveInfo | null>;
}


/**
 * idからユーザーを取得する
 */

class GetUserInteractor implements IGetUserService {
    public async getUser(id: number): Promise<UserWithoutSensitiveInfo | null> {
        try {
            console.info("id", id);
            const user = await userRepository.findUserById(id);
            console.info("user", user);
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                userId: user.userId,
                name: user.name,
                avater: user.avater,
                introduction: user.introduction,
            };
        } catch (error) {
            console.error("Error getting user:", error);
            return null;
        }
    }
}

export default GetUserInteractor;
