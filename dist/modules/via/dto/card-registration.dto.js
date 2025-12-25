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
exports.VerifyCardDto = exports.RegisterCardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterCardDto {
}
exports.RegisterCardDto = RegisterCardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "5614684090151111" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(16, 16),
    __metadata("design:type", String)
], RegisterCardDto.prototype, "pan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "04" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 2),
    __metadata("design:type", String)
], RegisterCardDto.prototype, "expMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "26" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 2),
    __metadata("design:type", String)
], RegisterCardDto.prototype, "expYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "998970000000" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], RegisterCardDto.prototype, "phone", void 0);
class VerifyCardDto {
}
exports.VerifyCardDto = VerifyCardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], VerifyCardDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "34431eb766424ace9234bf0d35c86bdb" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyCardDto.prototype, "verifyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123321" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], VerifyCardDto.prototype, "verifyCode", void 0);
//# sourceMappingURL=card-registration.dto.js.map