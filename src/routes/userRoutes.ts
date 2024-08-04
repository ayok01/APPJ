import { Router } from "express";
import { userController } from "../controller/userController";
import { articleController } from "../controller/articleController";


const router = Router();

const multer = require("multer");
const uuid = require("uuid");


//todo:あとでserviceに移動
const createFileName = (filename: string) => {
	const date = new Date(
		new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" }),
	);
	//ファイル名はUUIDを使用する
	const uuidv4 = uuid.v4();
	//ファイルめいの拡張子を取得
	const ext = filename.split(".").pop();
	return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${uuidv4}.${ext}`;
};

const storage = multer.diskStorage({
	destination: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void,
	) => {
		cb(null, "./public/images/thumbnail");
	},
	// ファイルの拡張子を指定
	filename: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void,
	) => {
		cb(null, createFileName(file.originalname));
	},
});

const upload = multer({ storage: storage });



router.post("/user", userController.addUser);
router.get("/users", userController.getUsers);
router.get("/user/:userId", userController.getUser);
router.get("/getMe", userController.getMe);
router.post("/uploadThumbnail",upload.single("image"), articleController.uploadThumbnail);
router.get("/thumbnail/:imageName", articleController.getThumbnailImage);

export default router;
