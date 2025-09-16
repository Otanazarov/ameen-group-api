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
const atmos_module_1 = require("../atmos/atmos.module");
const buttons_module_1 = require("../buttons/buttons.module");
const message_module_1 = require("../message/message.module");
const octobank_module_1 = require("../octobank/octobank.module");
const settings_module_1 = require("../settings/settings.module");
const subscription_type_module_1 = require("../subscription-type/subscription-type.module");
const user_module_1 = require("../user/user.module");
const telegram_button_service_1 = require("./services/telegram.button.service");
const telegram_callback_service_1 = require("./services/telegram.callback.service");
const telegram_cron_service_1 = require("./services/telegram.cron.service");
const telegram_registration_service_1 = require("./services/telegram.registration.service");
const telegram_sender_service_1 = require("./services/telegram.sender.service");
const telegram_settings_service_1 = require("./services/telegram.settings.service");
const telegram_subscription_service_1 = require("./services/telegram.subscription.service");
const telegram_service_1 = require("./telegram.service");
const telegram_message_service_1 = require("./services/telegram.message.service");
const telegram_update_1 = require("./telegram.update");
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
        providers: [
            telegram_service_1.TelegramService,
            telegram_update_1.TelegramUpdate,
            telegram_callback_service_1.TelegramCallbackService,
            telegram_cron_service_1.TelegramCronService,
            telegram_registration_service_1.TelegramRegistrationService,
            telegram_sender_service_1.TelegramSenderService,
            telegram_settings_service_1.TelegramSettingsService,
            telegram_subscription_service_1.TelegramSubscriptionService,
            telegram_button_service_1.TelegramButtonService,
            telegram_message_service_1.TelegramMessageService,
        ],
        exports: [
            telegram_service_1.TelegramService,
            telegram_callback_service_1.TelegramCallbackService,
            telegram_cron_service_1.TelegramCronService,
            telegram_registration_service_1.TelegramRegistrationService,
            telegram_sender_service_1.TelegramSenderService,
            telegram_settings_service_1.TelegramSettingsService,
            telegram_subscription_service_1.TelegramSubscriptionService,
            telegram_button_service_1.TelegramButtonService,
            telegram_message_service_1.TelegramMessageService,
        ],
    })
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map