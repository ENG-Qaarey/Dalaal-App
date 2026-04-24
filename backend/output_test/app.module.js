"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const config_2 = require("./config");
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const listings_module_1 = require("./listings/listings.module");
const properties_module_1 = require("./properties/properties.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const chat_module_1 = require("./chat/chat.module");
const payments_module_1 = require("./payments/payments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reviews_module_1 = require("./reviews/reviews.module");
const search_module_1 = require("./search/search.module");
const escrow_module_1 = require("./escrow/escrow.module");
const uploads_module_1 = require("./uploads/uploads.module");
const favorites_module_1 = require("./favorites/favorites.module");
const verification_module_1 = require("./verification/verification.module");
const admin_module_1 = require("./admin/admin.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    config_2.appConfig,
                    config_2.databaseConfig,
                    config_2.jwtConfig,
                    config_2.cloudinaryConfig,
                    config_2.emailConfig,
                    config_2.smsConfig,
                    config_2.redisConfig,
                    config_2.mapConfig,
                    config_2.paymentConfig,
                    config_2.firebaseConfig,
                ],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            listings_module_1.ListingsModule,
            properties_module_1.PropertiesModule,
            vehicles_module_1.VehiclesModule,
            chat_module_1.ChatModule,
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
            reviews_module_1.ReviewsModule,
            search_module_1.SearchModule,
            escrow_module_1.EscrowModule,
            uploads_module_1.UploadsModule,
            favorites_module_1.FavoritesModule,
            verification_module_1.VerificationModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map