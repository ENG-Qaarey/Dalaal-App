import { DocumentType } from '../../common/enums';
export declare class VerifyIdentityDto {
    documentType: DocumentType;
    documentNumber?: string;
    documentImage?: string;
    selfieImage?: string;
}
