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
exports.OctoBankController = void 0;
const common_1 = require("@nestjs/common");
const decorator_auth_1 = require("../../common/auth/decorator.auth");
const octobank_dto_1 = require("./dto/octobank.dto");
const octobank_service_1 = require("./octobank.service");
const create_session_dto_1 = require("./dto/create-session.dto");
let OctoBankController = class OctoBankController {
    constructor(octobankService) {
        this.octobankService = octobankService;
    }
    async createCheckoutSession(dto) {
        return await this.octobankService.createCheckoutSession(dto);
    }
    async handleWebhook(dto) {
        return await this.octobankService.webhook(dto);
    }
};
exports.OctoBankController = OctoBankController;
__decorate([
    (0, common_1.Post)('create-checkout-session'),
    (0, common_1.HttpCode)(200),
    (0, decorator_auth_1.DecoratorWrapper)('OctoBank Create Checkout Session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], OctoBankController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, decorator_auth_1.DecoratorWrapper)('OctoBank Webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [octobank_dto_1.OctobankDto]),
    __metadata("design:returntype", Promise)
], OctoBankController.prototype, "handleWebhook", null);
exports.OctoBankController = OctoBankController = __decorate([
    (0, common_1.Controller)('octobank'),
    __metadata("design:paramtypes", [octobank_service_1.OctoBankService])
], OctoBankController);
//# sourceMappingURL=octobank.controller.js.map