import { registerAs } from '@nestjs/config';

export const mapConfig = registerAs('map', () => ({
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
}));
