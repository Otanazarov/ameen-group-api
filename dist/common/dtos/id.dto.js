"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsId = IsId;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function IsId(required = true) {
    return required
        ? (0, common_1.applyDecorators)((0, swagger_1.ApiProperty)({ example: 1 }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_transformer_1.Type)(() => Number))
        : (0, common_1.applyDecorators)((0, swagger_1.ApiPropertyOptional)({ example: 1 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_transformer_1.Type)(() => Number));
}
//# sourceMappingURL=id.dto.js.map