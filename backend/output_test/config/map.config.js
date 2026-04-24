"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapConfig = void 0;
const config_1 = require("@nestjs/config");
exports.mapConfig = (0, config_1.registerAs)('map', () => ({
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
}));
//# sourceMappingURL=map.config.js.map