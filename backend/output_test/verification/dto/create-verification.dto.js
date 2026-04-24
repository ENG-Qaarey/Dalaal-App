"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVerificationStatusDto = exports.CreateVerificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../common/enums");
class CreateVerificationDto {
    documentType;
    documentNumber;
    frontImageUrl;
    backImageUrl;
    selfieImageUrl;
}
exports.CreateVerificationDto = CreateVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.DocumentType }),
    (0, class_validator_1.IsEnum)(enums_1.DocumentType),
    __metadata("design:type", String)
], CreateVerificationDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVerificationDto.prototype, "documentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVerificationDto.prototype, "frontImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVerificationDto.prototype, "backImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVerificationDto.prototype, "selfieImageUrl", void 0);
class UpdateVerificationStatusDto {
    status;
    rejectionReason;
}
exports.UpdateVerificationStatusDto = UpdateVerificationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['APPROVED', 'REJECTED'] }),
    (0, class_validator_1.IsEnum)(['APPROVED', 'REJECTED']),
    __metadata("design:type", String)
], UpdateVerificationStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVerificationStatusDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=create-verification.dto.js.map