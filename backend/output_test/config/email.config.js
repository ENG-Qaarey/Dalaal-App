"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = void 0;
const config_1 = require("@nestjs/config");
exports.emailConfig = (0, config_1.registerAs)('email', () => ({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
    appName: process.env.APP_NAME || 'Dalaal App',
}));
//# sourceMappingURL=email.config.js.map