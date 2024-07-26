import { User } from "../../entity/user";  
import { userRepository } from "../../repository/userRepository";  
  
const generateSessionId = (): string => {  
  const LENGTH = 24;  
  const SOURCE = "abcdefghijklmnopqrstuvwxyz0123456789";  
  let result = "";  
  for (let i = 0; i < LENGTH; i++) {  
    result += SOURCE[Math.floor(Math.random() * SOURCE.length)];  
  }  
  return result;  
};  
  
export const addUser = async (data: Omit<User, "id" | "token">): Promise<User> => {  
  const token = generateSessionId();  
  return await userRepository.createUser({ ...data, token });  
};  