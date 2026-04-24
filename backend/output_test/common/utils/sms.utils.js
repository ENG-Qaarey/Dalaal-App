"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPhoneNumber = exports.formatPhoneNumber = exports.generateVerificationCode = exports.generateOTP = void 0;
const uuid_1 = require("uuid");
const generateOTP = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
};
exports.generateOTP = generateOTP;
const generateVerificationCode = () => {
    return (0, uuid_1.v4)();
};
exports.generateVerificationCode = generateVerificationCode;
const formatPhoneNumber = (phone, countryCode = '+252') => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
        return `${countryCode}${cleaned.substring(1)}`;
    }
    return `${countryCode}${cleaned}`;
};
exports.formatPhoneNumber = formatPhoneNumber;
const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};
exports.isValidPhoneNumber = isValidPhoneNumber;
//# sourceMappingURL=sms.utils.js.map