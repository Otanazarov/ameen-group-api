"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const telegram_update_1 = require("./telegram.update");
const telegram_service_1 = require("./telegram.service");
const user_module_1 = require("../user/user.module");
const subscription_type_module_1 = require("../subscription-type/subscription-type.module");
const settings_module_1 = require("../settings/settings.module");
const message_module_1 = require("../message/message.module");
const octobank_module_1 = require("../octobank/octobank.module");
const buttons_module_1 = require("../buttons/buttons.module");
const atmos_module_1 = require("../atmos/atmos.module");
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            subscription_type_module_1.SubscriptionTypeModule,
            settings_module_1.SettingsModule,
            buttons_module_1.ButtonsModule,
            (0, common_1.forwardRef)(() => octobank_module_1.OctoBankModule),
            (0, common_1.forwardRef)(() => atmos_module_1.AtmosModule),
            (0, common_1.forwardRef)(() => message_module_1.MessageModule),
        ],
        providers: [telegram_service_1.TelegramService, telegram_update_1.TelegramUpdate],
        exports: [telegram_service_1.TelegramService],
    })
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map