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
exports.ButtonsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorator_auth_1 = require("../../common/auth/decorator.auth");
const role_enum_1 = require("../../common/auth/roles/role.enum");
const buttons_service_1 = require("./buttons.service");
const create_buttons_dto_1 = require("./dto/create-buttons.dto");
const update_buttons_dto_1 = require("./dto/update-buttons.dto");
const findAll_buttons_dto_1 = require("./dto/findAll-buttons.dto");
let ButtonsController = class ButtonsController {
    constructor(buttonsService) {
        this.buttonsService = buttonsService;
    }
    create(createButtonDto) {
        return this.buttonsService.create(createButtonDto);
    }
    findAll(dto) {
        return this.buttonsService.findAll(dto);
    }
    findOne(id) {
        return this.buttonsService.findOne(id);
    }
    update(id, updateButtonDto) {
        return this.buttonsService.update(id, updateButtonDto);
    }
    remove(id) {
        return this.buttonsService.remove(id);
    }
};
exports.ButtonsController = ButtonsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorator_auth_1.DecoratorWrapper)('Create Button', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_buttons_dto_1.CreateButtonDto]),
    __metadata("design:returntype", void 0)
], ButtonsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorator_auth_1.DecoratorWrapper)('Find All Buttons', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [findAll_buttons_dto_1.FindAllButtonDto]),
    __metadata("design:returntype", void 0)
], ButtonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorator_auth_1.DecoratorWrapper)('Find One Button', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ButtonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorator_auth_1.DecoratorWrapper)('Update Button', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_buttons_dto_1.UpdateButtonDto]),
    __metadata("design:returntype", void 0)
], ButtonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorator_auth_1.DecoratorWrapper)('Remove Button', true, [role_enum_1.Role.Admin]),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ButtonsController.prototype, "remove", null);
exports.ButtonsController = ButtonsController = __decorate([
    (0, common_1.Controller)('buttons'),
    (0, swagger_1.ApiTags)('Buttons'),
    __metadata("design:paramtypes", [buttons_service_1.ButtonsService])
], ButtonsController);
//# sourceMappingURL=buttons.controller.js.map