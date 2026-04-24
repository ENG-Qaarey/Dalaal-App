import { DocumentType } from '../../common/enums';
export declare class CreateVerificationDto {
    documentType: DocumentType;
    documentNumber: string;
    frontImageUrl: string;
    backImageUrl?: string;
    selfieImageUrl: string;
}
export declare class UpdateVerificationStatusDto {
    status: 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
}
