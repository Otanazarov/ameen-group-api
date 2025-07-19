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
exports.SubscriptionTypeController = void 0;
const common_1 = require("@nestjs/common");
const subscription_type_service_1 = require("./subscription-type.service");
const create_subscription_type_dto_1 = require("./dto/create-subscription-type.dto");
const update_subscription_type_dto_1 = require("./dto/update-subscription-type.dto");
const decorator_auth_1 = require("../../common/auth/decorator.auth");
const role_enum_1 = require("../../common/auth/roles/role.enum");
const findAll_subscriptionType_dto_1 = require("./dto/findAll-subscriptionType.dto");
const swagger_1 = require("@nestjs/swagger");
let SubscriptionTypeController = class SubscriptionTypeController {
    constructor(subscriptionTypeService) {
        this.subscriptionTypeService = subscriptionTypeService;
    }
    create(createSubscriptionTypeDto) {
        return this.subscriptionTypeService.create(createSubscriptionTypeDto);
    }
    findAll(dto) {
        return this.subscriptionTypeService.findAll(dto);
    }
    findOne(id) {
        return this.subscriptionTypeService.findOne(+id);
    }
    update(id, updateSubscriptionTypeDto) {
        return this.subscriptionTypeService.update(+id, updateSubscriptionTypeDto);
    }
    remove(id) {
        return this.subscriptionTypeService.remove(+id);
    }
};
exports.SubscriptionTypeController = SubscriptionTypeController;
__decorate([
    (0, common_1.Post)(),
    (0, decorator_auth_1.DecoratorWrapper)('Create Subscription Type', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subscription_type_dto_1.CreateSubscriptionTypeDto]),
    __metadata("design:returntype", void 0)
], SubscriptionTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorator_auth_1.DecoratorWrapper)('Find All Subscription Types'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [findAll_subscriptionType_dto_1.FindAllSubscriptionTypeDto]),
    __metadata("design:returntype", void 0)
], SubscriptionTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorator_auth_1.DecoratorWrapper)('Find One Subscription Type'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorator_auth_1.DecoratorWrapper)('Update Subscription Type', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscription_type_dto_1.UpdateSubscriptionTypeDto]),
    __metadata("design:returntype", void 0)
], SubscriptionTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorator_auth_1.DecoratorWrapper)('Remove Subscription Type', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionTypeController.prototype, "remove", null);
exports.SubscriptionTypeController = SubscriptionTypeController = __decorate([
    (0, common_1.Controller)('subscription-type'),
    (0, swagger_1.ApiTags)('Subscription Type'),
    __metadata("design:paramtypes", [subscription_type_service_1.SubscriptionTypeService])
], SubscriptionTypeController);
//# sourceMappingURL=subscription-type.controller.js.map