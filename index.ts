import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

// アプリケーションで動作するようにdotenvを設定する
const app = express();
const port =3000;

var sqlite3 = require('sqlite3');
//データベースオブジェクトの取得
const prisma = new PrismaClient();

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  console.log(users)
  return res.json(users);
});

app.post('/users',async (req: Request, res: Response,next:NextFunction)=>{
    try{
        console.log(req.body);
        const { url, title } = req.body;
        const user = await prisma.user.create({
            data: {
                url:url,
                title:title
            },
        });
        return res.json(user);
    }catch(e){
        next(e)
    }

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));