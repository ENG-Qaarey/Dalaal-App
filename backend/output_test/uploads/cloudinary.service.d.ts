import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadImage(file: any): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteImage(publicId: string): Promise<{
        result: string;
    }>;
}
