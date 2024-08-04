import  configureMulter  from "../infrastructure/multerConfig";
class UploadThumbnailInteractor {
    private directory: string;

    constructor(directory: string) {
        this.directory = directory;
    }

    public async execute(filePath: string): Promise<{ path: string }> {
        const multer = new configureMulter(this.directory);
        const upload = multer.configure();
        upload.single("image");
        
        return { path: filePath };
    }
}

export default UploadThumbnailInteractor;