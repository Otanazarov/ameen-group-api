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
exports.ViaController = void 0;
const common_1 = require("@nestjs/common");
const via_service_1 = require("./via.service");
const subscription_service_1 = require("../subscription/subscription.service");
const swagger_1 = require("@nestjs/swagger");
const decorator_auth_1 = require("../../common/auth/decorator.auth");
const create_contract_req_dto_1 = require("./dto/create-contract-req.dto");
const card_registration_dto_1 = require("./dto/card-registration.dto");
let ViaController = class ViaController {
    constructor(viaService, subscriptionService) {
        this.viaService = viaService;
        this.subscriptionService = subscriptionService;
    }
    async createContract(dto) {
        return this.subscriptionService.createViaSubscription(dto.userId, dto.subscriptionTypeId, dto.cardToken);
    }
    async registerCard(dto) {
        return this.viaService.registerCard(dto);
    }
    async verifyCard(dto) {
        return this.viaService.verifyCard(dto);
    }
    async deactivateContract(id) {
        return this.subscriptionService.deactivateViaSubscription(id);
    }
    async deleteContract(id) {
        return this.subscriptionService.deleteViaSubscription(id);
    }
    async getCardInfo(dto) {
        return this.viaService.getCardInfoByToken(dto);
    }
    async activateContract(id) {
        return this.viaService.activateContract(id);
    }
    async getContractInfo(id) {
        return this.viaService.getContractInfo(id);
    }
};
exports.ViaController = ViaController;
__decorate([
    (0, common_1.Post)('create-contract'),
    (0, decorator_auth_1.DecoratorWrapper)('Create Via Subscription Contract'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a subscription contract via Via' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contract_req_dto_1.CreateContractRequestDto]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "createContract", null);
__decorate([
    (0, common_1.Post)('card/register'),
    (0, decorator_auth_1.DecoratorWrapper)('Register Via Card'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a card via Via' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [card_registration_dto_1.RegisterCardDto]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "registerCard", null);
__decorate([
    (0, common_1.Post)('card/verify'),
    (0, decorator_auth_1.DecoratorWrapper)('Verify Via Card'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a card via Via' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [card_registration_dto_1.VerifyCardDto]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "verifyCard", null);
__decorate([
    (0, common_1.Delete)('deactivate-contract/:id'),
    (0, decorator_auth_1.DecoratorWrapper)('Deactivate Via Contract'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a subscription contract by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "deactivateContract", null);
__decorate([
    (0, common_1.Delete)('delete-contract/:id'),
    (0, decorator_auth_1.DecoratorWrapper)('Delete Via Contract'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a subscription contract by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "deleteContract", null);
__decorate([
    (0, common_1.Post)('card/info'),
    (0, decorator_auth_1.DecoratorWrapper)('Get Card Info by Token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get card details by token via Via' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "getCardInfo", null);
__decorate([
    (0, common_1.Post)('activate-contract/:id'),
    (0, decorator_auth_1.DecoratorWrapper)('Activate Via Subscription Contract'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a subscription contract via Via' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "activateContract", null);
__decorate([
    (0, common_1.Get)('contract-info/:id'),
    (0, decorator_auth_1.DecoratorWrapper)('Get Via Contract Info'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a subscription contract info by ID via Via' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViaController.prototype, "getContractInfo", null);
exports.ViaController = ViaController = __decorate([
    (0, swagger_1.ApiTags)('Via Payment'),
    (0, common_1.Controller)('via'),
    __metadata("design:paramtypes", [via_service_1.ViaService,
        subscription_service_1.SubscriptionService])
], ViaController);
//# sourceMappingURL=via.controller.js.map