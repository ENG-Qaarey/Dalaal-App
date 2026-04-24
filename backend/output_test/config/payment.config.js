"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentConfig = void 0;
const config_1 = require("@nestjs/config");
exports.paymentConfig = (0, config_1.registerAs)('payment', () => ({
    platformFeePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '2.5'),
    escrowCommissionPercentage: parseFloat(process.env.ESCROW_COMMISSION_PERCENTAGE || '5'),
    evcPlusApiKey: process.env.EVC_PLUS_API_KEY || '',
    evcPlusMerchantId: process.env.EVC_PLUS_MERCHANT_ID || '',
    zaadApiKey: process.env.ZAAD_API_KEY || '',
    zaadMerchantId: process.env.ZAAD_MERCHANT_ID || '',
    sahalApiKey: process.env.SAHAL_API_KEY || '',
    sahalMerchantId: process.env.SAHAL_MERCHANT_ID || '',
}));
//# sourceMappingURL=payment.config.js.map