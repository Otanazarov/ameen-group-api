"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorWrapper = DecoratorWrapper;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("./auth.guard");
const roles_decorator_1 = require("./roles/roles.decorator");
function DecoratorWrapper(summary, authRequired = false, roles) {
    return authRequired
        ? (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
            summary: summary.split('-')[0],
            description: summary.split('-')[1],
        }), (0, swagger_1.ApiBearerAuth)('token'), (0, swagger_1.ApiHeader)({ name: 'Authorization', required: false }), (0, roles_decorator_1.Roles)(...roles), (0, common_1.UseGuards)(auth_guard_1.AuthorizationGuard))
        : (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary }));
}
//# sourceMappingURL=decorator.auth.js.map