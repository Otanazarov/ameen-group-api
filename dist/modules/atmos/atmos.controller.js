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
exports.AtmosController = void 0;
const common_1 = require("@nestjs/common");
const atmos_service_1 = require("./atmos.service");
const create_dto_1 = require("./dto/create.dto");
const preapply_dto_1 = require("./dto/preapply.dto");
const apply_dto_1 = require("./dto/apply.dto");
const decorator_auth_1 = require("../../common/auth/decorator.auth");
const bind_card_init_dto_1 = require("./dto/bind-card-init.dto");
const bind_card_confirm_dto_1 = require("./dto/bind-card-confirm.dto");
const confirm_scheduler_dto_1 = require("./dto/confirm-scheduler.dto");
let AtmosController = class AtmosController {
    constructor(atmosService) {
        this.atmosService = atmosService;
    }
    createLink(dto) {
        return this.atmosService.createLink(dto);
    }
    async preapply(dto) {
        return this.atmosService.preApplyTransaction(dto);
    }
    apply(dto) {
        return this.atmosService.applyTransaction(dto);
    }
    bindCardInit(dto) {
        return this.atmosService.bindCardInit(dto);
    }
    bindCardConfirm(dto) {
        return this.atmosService.bindCardConfirm(dto);
    }
    confirmScheduler(dto) {
        return this.atmosService.confirmScheduler(dto);
    }
};
exports.AtmosController = AtmosController;
__decorate([
    (0, common_1.Post)(),
    (0, decorator_auth_1.DecoratorWrapper)('Create Atmos Link'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateAtmosDto]),
    __metadata("design:returntype", void 0)
], AtmosController.prototype, "createLink", null);
__decorate([
    (0, common_1.Post)('/preapply'),
    (0, decorator_auth_1.DecoratorWrapper)('Atmos Pre-apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preapply_dto_1.PreApplyAtmosDto]),
    __metadata("design:returntype", Promise)
], AtmosController.prototype, "preapply", null);
__decorate([
    (0, common_1.Post)('/apply'),
    (0, decorator_auth_1.DecoratorWrapper)('Atmos Apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_dto_1.ApplyAtmosDto]),
    __metadata("design:returntype", void 0)
], AtmosController.prototype, "apply", null);
__decorate([
    (0, common_1.Post)('bind-card/init'),
    (0, decorator_auth_1.DecoratorWrapper)('Bind card init'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bind_card_init_dto_1.BindCardInitDto]),
    __metadata("design:returntype", void 0)
], AtmosController.prototype, "bindCardInit", null);
__decorate([
    (0, common_1.Post)('bind-card/confirm'),
    (0, decorator_auth_1.DecoratorWrapper)('Bind card confirm'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bind_card_confirm_dto_1.BindCardConfirmDto]),
    __metadata("design:returntype", void 0)
], AtmosController.prototype, "bindCardConfirm", null);
__decorate([
    (0, common_1.Post)('scheduler/confirm'),
    (0, decorator_auth_1.DecoratorWrapper)('Confirm scheduler'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_scheduler_dto_1.ConfirmSchedulerDto]),
    __metadata("design:returntype", void 0)
], AtmosController.prototype, "confirmScheduler", null);
exports.AtmosController = AtmosController = __decorate([
    (0, common_1.Controller)('atmos'),
    __metadata("design:paramtypes", [atmos_service_1.AtmosService])
], AtmosController);
//# sourceMappingURL=atmos.controller.js.map