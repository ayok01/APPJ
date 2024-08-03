import { Router } from "express";
import { userController } from "../controller/userController";

const router = Router();

router.post("/user", userController.addUser);
router.get("/users", userController.getUsers);
router.get("/user/:userId", userController.getUser);
router.get("/getMe", userController.getMe);

export default router;
