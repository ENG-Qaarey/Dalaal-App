import { PaymentProvider, PaymentType } from '../../common/enums';
export declare class CreatePaymentDto {
    amount: number;
    provider: PaymentProvider;
    type: PaymentType;
    listingId?: string;
    recipientId?: string;
}
export declare class VerifyPaymentDto {
    transactionId: string;
}
