"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsConfig = void 0;
const config_1 = require("@nestjs/config");
exports.smsConfig = (0, config_1.registerAs)('sms', () => ({
    africaTalkingUsername: process.env.AFRICASTALKING_USERNAME || '',
    africaTalkingApiKey: process.env.AFRICASTALKING_API_KEY || '',
    africaTalkingFrom: process.env.AFRICASTALKING_FROM || '',
}));
//# sourceMappingURL=sms.config.js.map