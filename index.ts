import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import fs from "fs";


// アプリケーションで動作するようにdotenvを設定する
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const port =3000;
//データベースオブジェクトの取得
const prisma = new PrismaClient();

const path = require('path');
const multer = require('multer');
const updir = path.dirname(__dirname).replace(/\\/g, "/") + "/tmp";  // アプリケーションフォルダのサブディレクトリ "./tmp" をアップロード先にしている。
const upload = multer({dest:updir});

app.get('/articles', async (req: Request, res: Response) => {
    try{
        const articles = await prisma.article.findMany();
        return res.json(articles);
    }catch(e){
        return res.status(500).send({'error':e})
    }
});

app.get('/article/:articleId',async(req: Request, res: Response) =>{
    try{
        if(Number.isNaN(Number(req.params.articleId))){
            console.log((Number(req.params.articleId)))
            return res.status(402).send({
                'error':Number(req.params.articleId)
            });
        }
        const id = Number(req.params.articleId)
        const article = await prisma.article.findFirst({
            where: {articleId:id},
            select:{
                articleId: true,
                thumbnail: true,
                title: true
            }
        });
        return res.json(article)
    }catch(e){
        return res.status(500).send({'error':e})
    }
})

// app.post('/single', upload.single('file1'), (req, res) => {
//     const file:any = req.file
//     const path = file.path.replace(/\\/g, "/");
//     if (path) {
//         const dest = updir + "/" + file.originalname;
//         fs.renameSync(path, dest);  // 長い一時ファイル名を元のファイル名にリネームする。
//         res.render('upload', {message: `${dest} にアップロードされました。`});
//     }
//     else {
//         res.render('upload', {message: "エラー：アップロードできませんでした。"});
//     }
// });

app.post('/article',async (req: Request, res: Response,next:NextFunction)=>{
    try{
        console.log(req.body);
        if(req.body == undefined){
            return res.status(400).send('')
        }
        const { url, title, body } = req.body;
        const user = await prisma.article.create({
            data: {
                thumbnail:url,
                title:title,
                body: body
            },
        });
        return res.json(user);
    }catch(e){
        next(e)
        return   res.status(500).send('Something broke!')
    }

})

app.post('/user',async(req: Request, res: Request)=>{
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));