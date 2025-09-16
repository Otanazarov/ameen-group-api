"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const atmos_service_1 = require("../../atmos/atmos.service");
const octobank_service_1 = require("../../octobank/octobank.service");
const subscription_type_service_1 = require("../../subscription-type/subscription-type.service");
const user_service_1 = require("../../user/user.service");
let TelegramSubscriptionService = class TelegramSubscriptionService {
    constructor(userService, subscriptionTypeService, octobankService, atmosService) {
        this.userService = userService;
        this.subscriptionTypeService = subscriptionTypeService;
        this.octobankService = octobankService;
        this.atmosService = atmosService;
        this.MS_PER_DAY = 1000 * 60 * 60 * 24;
    }
    calculateDaysLeft(expiredDate) {
        return Math.ceil((expiredDate.getTime() - Date.now()) / this.MS_PER_DAY);
    }
    async handleSubscriptionPayment(ctx, subscriptionTypeId) {
        const subscriptionType = await this.subscriptionTypeService.findOne(subscriptionTypeId);
        if (!subscriptionType) {
            await ctx.answerCallbackQuery('❌ Subscription type not found');
            await ctx.deleteMessage();
            return;
        }
        const subscription = await this.userService.getSubscription(ctx.from.id);
        const daysLeft = subscription
            ? this.calculateDaysLeft(subscription.expiredDate)
            : 0;
        if (subscription &&
            subscription.subscriptionTypeId == subscriptionTypeId &&
            daysLeft > 3) {
            await ctx.answerCallbackQuery({
                text: "⚠️ Siz allaqachon ushbu obunaga a'zo bo'lgansiz",
                show_alert: true,
            });
            return;
        }
        const user = await this.userService.findOneByTelegramID(ctx.from.id.toString());
        const atmos = await this.atmosService.createLink({
            subscriptionTypeId: subscriptionType.id,
            userId: user.id,
        });
        const octobank = await this.octobankService.createCheckoutSession({
            subscriptionTypeId,
            userId: user.id,
        });
        return { subscriptionType, octobank, atmos };
    }
};
exports.TelegramSubscriptionService = TelegramSubscriptionService;
exports.TelegramSubscriptionService = TelegramSubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => octobank_service_1.OctoBankService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => atmos_service_1.AtmosService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        subscription_type_service_1.SubscriptionTypeService,
        octobank_service_1.OctoBankService,
        atmos_service_1.AtmosService])
], TelegramSubscriptionService);
//# sourceMappingURL=telegram.subscription.service.js.map