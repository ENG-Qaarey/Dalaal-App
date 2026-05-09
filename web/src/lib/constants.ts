export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002/chat';

export const APP_NAME = 'Dalaal Prime';
export const APP_DESCRIPTION = 'Somalia\'s Premier Marketplace for Properties, Vehicles, and Services';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/:id',
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: '/vehicles/:id',
  MY_LISTINGS: '/my-listings',
  PROFILE: '/profile',
  CHAT: '/chat',
};

export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'HOUSE', label: 'House' },
  { value: 'LAND', label: 'Land' },
  { value: 'COMMERCIAL', label: 'Commercial' },
];

export const CITIES = [
  'Mogadishu',
  'Hargeisa',
  'Garowe',
  'Kismayo',
  'Baidoa',
  'Bosaso',
  'Beledweyne',
];

export const COUNTRIES = [
  { label: 'Somalia', value: 'SO' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Djibouti', value: 'DJ' },
  { label: 'Uganda', value: 'UG' },
];

export const CURRENCIES = ['USD', 'SOS', 'KES', 'EUR'];

export const DEFAULT_PAGINATION_LIMIT = 20;
