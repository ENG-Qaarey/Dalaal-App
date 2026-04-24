"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryConfig = void 0;
const config_1 = require("@nestjs/config");
exports.cloudinaryConfig = (0, config_1.registerAs)('cloudinary', () => ({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
}));
//# sourceMappingURL=cloudinary.config.js.map