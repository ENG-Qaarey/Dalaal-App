"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiVerificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiVerificationService = void 0;
const common_1 = require("@nestjs/common");
let AiVerificationService = AiVerificationService_1 = class AiVerificationService {
    logger = new common_1.Logger(AiVerificationService_1.name);
    async verifyDocument(frontUrl, backUrl, selfieUrl) {
        this.logger.log('Performing AI verification (simulated)');
        return {
            isVerified: true,
            confidenceScore: 0.95,
            extractedData: {
                fullName: 'Test User',
                documentNumber: 'SO-123456',
                expiryDate: '2030-01-01',
            },
        };
    }
};
exports.AiVerificationService = AiVerificationService;
exports.AiVerificationService = AiVerificationService = AiVerificationService_1 = __decorate([
    (0, common_1.Injectable)()
], AiVerificationService);
//# sourceMappingURL=ai-verification.service.js.map