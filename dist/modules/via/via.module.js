"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaModule = void 0;
const common_1 = require("@nestjs/common");
const via_service_1 = require("./via.service");
const via_controller_1 = require("./via.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const telegram_module_1 = require("../telegram/telegram.module");
const subscription_module_1 = require("../subscription/subscription.module");
let ViaModule = class ViaModule {
};
exports.ViaModule = ViaModule;
exports.ViaModule = ViaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, telegram_module_1.TelegramModule, (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule)],
        controllers: [via_controller_1.ViaController],
        providers: [via_service_1.ViaService],
        exports: [via_service_1.ViaService],
    })
], ViaModule);
//# sourceMappingURL=via.module.js.map