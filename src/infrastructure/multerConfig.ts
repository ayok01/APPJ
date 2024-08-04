import { createFileName } from "../domain/service/fileService";
import type { Request } from "express";
import { type Multer, diskStorage } from "multer";
import * as fs from "node:fs";


const multer = require("multer");


/**
 * ファイルをアップロードして保存したパスを返す
 * @param file アップロードされたファイル
 * @param directory ファイルの保存先のディレクトリ
 * @returns ファイルの保存先のパス
 */

class MulterConfig {
    private directory: string;

    constructor(directory: string) {
        this.directory = directory;
    }

    // ディレクトリが存在しない場合は作成する
    private createDirectoryIfNotExists(): void {
        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory, { recursive: true });
        }
    }

    public configure(): Multer {
        this.createDirectoryIfNotExists();
        const storage = diskStorage({
            destination: (
                req: Request,
                file: Express.Multer.File,
                cb: (error: Error | null, destination: string) => void,
            ) => {
                cb(null, this.directory);
            },
            filename: (
                req: Request,
                file: Express.Multer.File,
                cb: (error: Error | null, filename: string) => void,
            ) => {
                cb(null, createFileName(file.originalname));
            },
        });

        return multer({ storage: storage });
    }
}

export default MulterConfig;