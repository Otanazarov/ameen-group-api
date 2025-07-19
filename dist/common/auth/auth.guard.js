"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationGuard = void 0;
const core_1 = require("@nestjs/core");
const roles_guard_1 = require("./roles/roles.guard");
exports.AuthorizationGuard = new roles_guard_1.RolesGuard(new core_1.Reflector());
//# sourceMappingURL=auth.guard.js.map