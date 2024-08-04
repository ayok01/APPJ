import * as fs from 'node:fs';
import * as pathModule from 'node:path'; // Rename the imported 'path' module to 'pathModule'
import { HttpError } from '../../interface_adapters/errors/httpError';
import UploadThumbnailInteractor from '../../domain/uploadThumbnailInteractor';
import { createFileName } from '../../domain/service/fileService';

export const uploadThumbnail = async (authorization:string, file:File ):Promise<string> => {
    try {
        // トークンチェック
        const token = authorization;
        if (!token) {
            throw new HttpError('Unauthorized', 401);
        }
     
        //パスのチェック
        const path = '../../public/images/thumbnail';
        const uploadThumbnailInteractor = new UploadThumbnailInteractor(path);
        const filePath = pathModule.join(path, createFileName(file.name)); // Use 'pathModule.join' instead of 'path.join'
        const result = uploadThumbnailInteractor.execute(filePath);
        return (await result).path;
    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        return '';
    }
}