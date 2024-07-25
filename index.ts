import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

// アプリケーションで動作するようにdotenvを設定する
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const port = 3000;
//データベースオブジェクトの取得
const prisma = new PrismaClient();

const path = require("path");
//Token生成
const generateSessionId = (): string => {
  const LENGTH = 24; //生成したい文字列の長さ
  const SOURCE = "abcdefghijklmnopqrstuvwxyz0123456789"; //元になる文字

  //Token
  let result = "";

  for (let i = 0; i < LENGTH; i++) {
    result += SOURCE[Math.floor(Math.random() * SOURCE.length)];
  }

  return result;
};

app.get("/articles", async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany();
    return res.json(articles);
  } catch (e) {
    return res.status(500).send({ error: e });
  }
});

const multer = require("multer");
var storage = multer.diskStorage({
  //ファイルの保存先を指定(ここでは保存先は./public/images)
  //Express4の仕様かなんかで画像staticなファイルを保存するときはpublic/以下のフォルダに置かないとダメらしい
  //詳しくは express.static public でググろう！
  destination: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, "./public/images/");
  },
  //ファイル名を指定
  //ここでは image.jpg という名前で保存
  filename: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, "image.jpg");
  },
});

const upload = multer({ storage: storage });

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).send("Invalid request");
      }
      return res.json({ path: req.file.path });
    } catch (e) {
      return res.status(500).send({ error: e });
    }
  }
);

app.get("/image/:imageName", async (req: Request, res: Response) => {
  try {
    const { imageName } = req.params;
    const filePath = path.join(__dirname, `../public/images/${imageName}`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Not found");
    }
    fs.readFile(filePath, (err, data) => {
      res.type("image/jpeg");
      console.log(data);
      res.send(data);
    });
  } catch (e) {
    return res.status(500).send({ error: e });
  }
});

app.post(
  "/article",
  async (req: Request, res: Response, next: NextFunction) => {
    // tokenの確認
    if (!req.headers.authorization) {
      return res.status(401).send("Unauthorized");
    }
    const token = req.headers.authorization;
    const user = await prisma.user.findFirst({
      where: { token: token },
    });
    if (!user) {
      return res.status(403).send("Forbidden");
    }
    try {
      if (
        !req.body.thumbnail ||
        !req.body.title ||
        !req.body.body ||
        !req.body.articleType ||
        !req.body.authorId
      ) {
        return res.status(400).send("Invalid request");
      }
      const { thumbnail, title, body, articleType, authorId } = req.body;
      const author = await prisma.user.findFirst({
        where: { id: authorId },
      });
      if (!author) {
        return res.status(404).send("Author not found");
      }
      const article = await prisma.article.create({
        data: {
          articleType: articleType,
          author: {
            connect: { id: author.id },
          },
          thumbnail: thumbnail,
          title: title,
          body: body,
        },
      });
      return res.json(article);
    } catch (e) {
      next(e);
      return res.status(500).send("Something broke!");
    }
  }
);

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (e) {
    return res.status(500).send({ error: e });
  }
});

app.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    if (Number.isNaN(Number(req.params.userId))) {
      console.log(Number(req.params.userId));
      return res.status(402).send({
        error: Number(req.params.userId),
      });
    }
    const id = Number(req.params.userId);
    const user = await prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        avater: true,
        introduction: true,
        password: true,
      },
    });
    return res.json(user);
  } catch (e) {
    return res.status(500).send({ error: e });
  }
});

app.post("/user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, avater, introduction, password } = req.body;
    const token = generateSessionId();
    const user = await prisma.user.create({
      data: {
        name: name,
        avater: avater,
        introduction: introduction,
        password: password,
        token: token,
      },
    });
    return res.json(user);
  } catch (e) {
    return res.status(500).send({ error: e });
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
