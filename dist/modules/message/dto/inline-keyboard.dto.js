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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineKeyboardDto = exports.InlineKeyboardRowDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const inline_button_dto_1 = require("./inline-button.dto");
class InlineKeyboardRowDto {
}
exports.InlineKeyboardRowDto = InlineKeyboardRowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [inline_button_dto_1.InlineButtonDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => inline_button_dto_1.InlineButtonDto),
    __metadata("design:type", Array)
], InlineKeyboardRowDto.prototype, "buttons", void 0);
class InlineKeyboardDto {
}
exports.InlineKeyboardDto = InlineKeyboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [InlineKeyboardRowDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InlineKeyboardRowDto),
    __metadata("design:type", Array)
], InlineKeyboardDto.prototype, "inline_keyboard", void 0);
//# sourceMappingURL=inline-keyboard.dto.js.map