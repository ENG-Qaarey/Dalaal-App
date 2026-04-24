import { VerificationService } from './verification.service';
import { CreateVerificationDto, UpdateVerificationStatusDto } from './dto';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    create(user: any, dto: CreateVerificationDto): Promise<{
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
    getMy(user: any): Promise<{
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
    findAllPending(): Promise<({
        user: {
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                currency: string | null;
                city: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                bio: string | null;
                country: string | null;
                isDiaspora: boolean;
                language: string | null;
                whatsappNumber: string | null;
                telegramHandle: string | null;
                totalListings: number;
                rating: number | null;
                reviewCount: number;
                responseRate: number | null;
            } | null;
        } & {
            email: string;
            password: string | null;
            id: string;
            phone: string | null;
            googleId: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            emailVerified: boolean;
            phoneVerified: boolean;
            twoFactorEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    })[]>;
    updateStatus(id: string, dto: UpdateVerificationStatusDto): Promise<{
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
