import { userRepository } from "../repository/userRepository";
import type { User } from "./entity/user";

export interface ICheckUserIdService {
    checkUserId(userId: string): Promise<boolean>;
}

class CheckUserIdService implements ICheckUserIdService {
    public async checkUserId(userId: string): Promise<boolean> {
        const user = await userRepository.findUserByUserId(userId);
        return user !== null;
    }
}

export default CheckUserIdService;