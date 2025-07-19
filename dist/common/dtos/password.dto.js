"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPassword = IsPassword;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
function IsPassword(required = true) {
    return required
        ? (0, common_1.applyDecorators)((0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsStrongPassword)({
            minLength: 4,
            minLowercase: 0,
            minNumbers: 0,
            minUppercase: 0,
            minSymbols: 0,
        }))
        : (0, common_1.applyDecorators)((0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsStrongPassword)({
            minLength: 4,
            minLowercase: 0,
            minNumbers: 0,
            minUppercase: 0,
            minSymbols: 0,
        }));
}
//# sourceMappingURL=password.dto.js.map