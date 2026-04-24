import { PrismaService } from '../database/prisma.service';
export declare class VerificationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        documentType: import(".prisma/client").$Enums.DocumentType;
        documentNumber: string | null;
        documentImage: string | null;
        selfieImage: string | null;
        businessLicense: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        rejectionReason: string | null;
    } | null>;
    create(data: any): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        documentType: import(".prisma/client").$Enums.DocumentType;
        documentNumber: string | null;
        documentImage: string | null;
        selfieImage: string | null;
        businessLicense: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        rejectionReason: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        documentType: import(".prisma/client").$Enums.DocumentType;
        documentNumber: string | null;
        documentImage: string | null;
        selfieImage: string | null;
        businessLicense: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        rejectionReason: string | null;
    }>;
}
