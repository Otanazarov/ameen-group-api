"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const grammy_1 = require("grammy");
const config_1 = require("./common/config");
const admin_module_1 = require("./modules/admin/admin.module");
const atmos_module_1 = require("./modules/atmos/atmos.module");
const message_module_1 = require("./modules/message/message.module");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const settings_module_1 = require("./modules/settings/settings.module");
const statistics_module_1 = require("./modules/statistics/statistics.module");
const subscription_type_module_1 = require("./modules/subscription-type/subscription-type.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const user_module_1 = require("./modules/user/user.module");
const octobank_module_1 = require("./modules/octobank/octobank.module");
const files_module_1 = require("./modules/files/files.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        imports: [
            admin_module_1.AdminModule,
            user_module_1.UserModule,
            settings_module_1.SettingsModule,
            message_module_1.MessageModule,
            subscription_module_1.SubscriptionModule,
            subscription_type_module_1.SubscriptionTypeModule,
            atmos_module_1.AtmosModule,
            octobank_module_1.OctoBankModule,
            prisma_module_1.PrismaModule,
            schedule_1.ScheduleModule.forRoot(),
            nestjs_1.NestjsGrammyModule.forRoot({
                token: config_1.env.TELEGRAM_BOT_TOKEN,
                pollingOptions: {
                    allowed_updates: [
                        'chat_member',
                        'message',
                        'callback_query',
                        'chat_join_request',
                    ],
                },
                middlewares: [
                    (0, grammy_1.session)({
                        initial: () => ({}),
                    }),
                ],
            }),
            statistics_module_1.StatisticsModule,
            files_module_1.FilesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map