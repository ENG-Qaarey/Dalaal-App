export declare class AiVerificationService {
    private readonly logger;
    verifyDocument(frontUrl: string, backUrl?: string, selfieUrl?: string): Promise<{
        isVerified: boolean;
        confidenceScore: number;
        extractedData: {
            fullName: string;
            documentNumber: string;
            expiryDate: string;
        };
    }>;
}
