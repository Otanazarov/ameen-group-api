"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsName = IsName;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
function IsName(required = true) {
    return required
        ? (0, common_1.applyDecorators)((0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)())
        : (0, common_1.applyDecorators)((0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)());
}
//# sourceMappingURL=name.dto.js.map