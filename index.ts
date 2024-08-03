// import * as fs from "node:fs";
// import { PrismaClient } from "@prisma/client";
// import express, {
// 	type NextFunction,
// 	type Request,
// 	type Response,
// } from "express";

// // アプリケーションで動作するようにdotenvを設定する
// const cors = require("cors");
// const app = express();
// app.use(express.json());
// app.use(
// 	cors({
// 		origin: "http://localhost:3000", //アクセス許可するオリジン
// 		credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
// 		optionsSuccessStatus: 200, //レスポンスstatusを200に設定
// 	}),
// 	express.urlencoded({
// 		extended: true,
// 	}),
// );

// const port = 8080;
// //データベースオブジェクトの取得
// const prisma = new PrismaClient();

// //ディレクトリがない場合は作成
// if (!fs.existsSync("./public/images/thumbnail")) {
// 	fs.mkdirSync("./public/images/thumbnail", { recursive: true });
// }

// import * as path from "node:path";
// //Token生成
// const generateSessionId = (): string => {
// 	const LENGTH = 24; //生成したい文字列の長さ
// 	const SOURCE = "abcdefghijklmnopqrstuvwxyz0123456789"; //元になる文字

// 	//Token
// 	let result = "";

// 	for (let i = 0; i < LENGTH; i++) {
// 		result += SOURCE[Math.floor(Math.random() * SOURCE.length)];
// 	}

// 	return result;
// };

// app.get("/article/:articleId", async (req: Request, res: Response) => {
// 	try {
// 		if (Number.isNaN(Number(req.params.articleId))) {
// 			return res.status(400).send("Invalid request");
// 		}
// 		const id = Number(req.params.articleId);
// 		const article = await prisma.article.findFirst({
// 			where: { articleId: id },
// 		});
// 		return res.json(article);
// 	} catch (e) {
// 		return res.status(500).send({ error: e });
// 	}
// });

// app.get("/articles", async (req: Request, res: Response) => {
// 	try {
// 		const articles = await prisma.article.findMany();
// 		return res.json(articles);
// 	} catch (e) {
// 		return res.status(500).send({ error: e });
// 	}
// });

// const multer = require("multer");

// const createFileName = (filename: string) => {
// 	const date = new Date(
// 		new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" }),
// 	);
// 	return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${filename}`;
// };

// const storage = multer.diskStorage({
// 	destination: (
// 		req: Request,
// 		file: Express.Multer.File,
// 		cb: (error: Error | null, destination: string) => void,
// 	) => {
// 		cb(null, "./public/images/thumbnail");
// 	},
// 	// ファイルの拡張子を指定
// 	filename: (
// 		req: Request,
// 		file: Express.Multer.File,
// 		cb: (error: Error | null, filename: string) => void,
// 	) => {
// 		cb(null, createFileName(file.originalname));
// 	},
// });

// const upload = multer({ storage: storage });

// app.post(
// 	"/upload",
// 	upload.single("image"),
// 	async (req: Request, res: Response) => {
// 		try {
// 			if (!req.file) {
// 				return res.status(400).send("Invalid request");
// 			}
// 			// ファイル名を返す
// 			return res.json({ filename: req.file.filename });
// 		} catch (e) {
// 			return res.status(500).send({ error: e });
// 		}
// 	},
// );

// app.get("/image/thumbnail/:imageName", async (req: Request, res: Response) => {
// 	try {
// 		const { imageName } = req.params;
// 		const filePath = path.join(
// 			__dirname,
// 			`../public/images/thumbnail/${imageName}`,
// 		);
// 		if (!fs.existsSync(filePath)) {
// 			return res.status(404).send("Not found");
// 		}
// 		fs.readFile(filePath, (err, data) => {
// 			res.type("image/jpeg");
// 			console.log(data);
// 			res.send(data);
// 		});
// 	} catch (e) {
// 		return res.status(500).send({ error: e });
// 	}
// });

// app.post(
// 	"/article",
// 	async (req: Request, res: Response, next: NextFunction) => {
// 		// tokenの確認
// 		if (!req.headers.authorization) {
// 			return res.status(401).send("Unauthorized");
// 		}
// 		const token = req.headers.authorization;
// 		const user = await prisma.user.findFirst({
// 			where: { token: token },
// 		});
// 		if (!user) {
// 			return res.status(403).send("Forbidden");
// 		}
// 		try {
// 			if (
// 				!req.body.thumbnail ||
// 				!req.body.title ||
// 				!req.body.body ||
// 				!req.body.articleType ||
// 				!req.body.authorId
// 			) {
// 				return res.status(400).send("Invalid request");
// 			}
// 			const { thumbnail, title, body, articleType, authorId } = req.body;
// 			const author = await prisma.user.findFirst({
// 				where: { id: authorId },
// 			});
// 			if (!author) {
// 				return res.status(404).send("Author not found");
// 			}
// 			const article = await prisma.article.create({
// 				data: {
// 					articleType: articleType,
// 					author: {
// 						connect: { id: author.id },
// 					},
// 					thumbnail: thumbnail,
// 					title: title,
// 					body: body,
// 				},
// 			});
// 			return res.json(article);
// 		} catch (e) {
// 			next(e);
// 			return res.status(500).send("Something broke!");
// 		}
// 	},
// );

// app.get("/users", async (req: Request, res: Response) => {
// 	try {
// 		const users = await prisma.user.findMany();
// 		return res.json(users);
// 	} catch (e) {
// 		return res.status(500).send({ error: e });
// 	}
// });

// app.get("/user/:userId", async (req: Request, res: Response) => {
// 	//トークン認証
// 	if (!req.headers.authorization) {
// 		return res.status(401).send("Unauthorized");
// 	}
// 	const token = req.headers.authorization;
// 	const user = await prisma.user.findFirst({
// 		where: { token: token },
// 	});
// 	if (!user) {
// 		return res.status(403).send("Forbidden");
// 	}
// 	try {
// 		if (Number.isNaN(Number(req.params.userId))) {
// 			console.log(Number(req.params.userId));
// 			return res.status(402).send({
// 				error: Number(req.params.userId),
// 			});
// 		}
// 		const id = Number(req.params.userId);
// 		const user = await prisma.user.findFirst({
// 			where: { id: id },
// 			select: {
// 				id: true,
// 				name: true,
// 				avater: true,
// 				introduction: true,
// 				password: true,
// 			},
// 		});
// 		return res.json(user);
// 	} catch (e) {
// 		return res.status(500).send({ error: e });
// 	}
// });

// app.post("/user", async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { name, avater, introduction, password } = req.body;
// 		const token = generateSessionId();
// 		const user = await prisma.user.create({
// 			data: {
// 				name: name,
// 				avater: avater,
// 				introduction: introduction,
// 				password: password,
// 				token: token,
// 			},
// 		});
// 		return res.json(user);
// 	} catch (e) {
// 		return res.status(500).send({ error: e });
// 	}
// });
// app.listen(port, () => console.log(`Example app listening on port ${port}!`));
