import type { Article } from "../domain/entity/article";
import type { Request, Response } from "express";
import MulterConfig from "../infrastructure/multerConfig";
import * as fs from "node:fs";
import * as path from "node:path";
// import {uploadThumbnail} from "../usecase/article/uploadThumbnail";
// import type { HttpError } from "../interface_adapters/errors/httpError";

export const articleController = {
    uploadThumbnail: async (req: Request, res: Response) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).send("Unauthorized");
        }
        console.log(req.file);
        console.log('file',req.headers);
        try {
            if (!req.file) {
                return res.status(400).send("Invalid request");
            }
            // ファイル名を返す
            return res.json({ filename: req.file.filename });
            } catch (e) {
                return res.status(500).send({ error: e });
            }
        },
    
    getThumbnailImage: async (req: Request, res: Response) => {
        try {
            const { imageName } = req.params;
            const filePath = path.join(
                __dirname,
                `../../../public/images/thumbnail/${imageName}`,
            );
            console.info('filePath',filePath);
            if (!fs.existsSync(filePath)) {
                return res.status(404).send({ error: "Not found" });
            }
            fs.readFile(filePath, (err, data) => {
                res.type("image/jpeg");
                console.log(data);
                res.send(data);
            });
        } catch (e) {
            return res.status(500).send({ error: e });
        }
    },
};

