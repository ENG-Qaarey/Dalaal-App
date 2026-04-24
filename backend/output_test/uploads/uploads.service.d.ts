import { CloudinaryService } from './cloudinary.service';
export declare class UploadsService {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadFile(file: any): Promise<{
        url: string;
        publicId: string;
    }>;
}
