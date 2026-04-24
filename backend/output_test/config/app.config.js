"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
    name: process.env.APP_NAME || 'Dalaal Prime',
    description: process.env.APP_DESCRIPTION || 'Somalia Premier Marketplace',
    version: process.env.APP_VERSION || '1.0.0',
}));
//# sourceMappingURL=app.config.js.map