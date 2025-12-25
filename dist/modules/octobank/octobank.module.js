"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OctoBankModule = void 0;
const common_1 = require("@nestjs/common");
const octobank_service_1 = require("./octobank.service");
const octobank_controller_1 = require("./octobank.controller");
const subscription_module_1 = require("../subscription/subscription.module");
const telegram_module_1 = require("../telegram/telegram.module");
const transaction_module_1 = require("../trasnaction/transaction.module");
let OctoBankModule = class OctoBankModule {
};
exports.OctoBankModule = OctoBankModule;
exports.OctoBankModule = OctoBankModule = __decorate([
    (0, common_1.Module)({
        providers: [octobank_service_1.OctoBankService],
        controllers: [octobank_controller_1.OctoBankController],
        exports: [octobank_service_1.OctoBankService],
        imports: [
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => transaction_module_1.TransactionModule),
            (0, common_1.forwardRef)(() => telegram_module_1.TelegramModule),
        ],
    })
], OctoBankModule);
//# sourceMappingURL=octobank.module.js.map