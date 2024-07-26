import { User } from "../../entity/user";  
import { userRepository } from "../../repository/userRepository";  
  
export const getUser = async (id: number): Promise<User | null> => {  
  return await userRepository.findUserById(id);  
};  