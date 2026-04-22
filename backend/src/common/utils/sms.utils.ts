import { v4 as uuidv4 } from 'uuid';

export const generateOTP = (length: number = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

export const generateVerificationCode = (): string => {
  return uuidv4();
};

export const formatPhoneNumber = (phone: string, countryCode: string = '+252'): string => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    return `${countryCode}${cleaned.substring(1)}`;
  }
  return `${countryCode}${cleaned}`;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};
