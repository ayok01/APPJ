import { Router } from "express";  
import { userController } from "../controller/userController";  
  
const router = Router();  
  
router.post("/user", userController.addUser);  
router.get("/user/:userId", userController.getUser);  
  
export default router;  