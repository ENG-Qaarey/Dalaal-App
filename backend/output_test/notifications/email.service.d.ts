import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, template: string, context: any): Promise<void>;
}
