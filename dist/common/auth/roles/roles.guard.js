"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_error_1 = require("../../exception/http.error");
const roles_decorator_1 = require("./roles.decorator");
const config_1 = require("../../config");
const access_token_version_store_1 = require("../access-token-version.store");
const refresh_token_version_store_1 = require("../refresh-token-version.store");
class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        try {
            const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
            const request = context.switchToHttp().getRequest();
            let bearerToken = request.headers['authorization'];
            if (!bearerToken) {
                (0, http_error_1.HttpError)({ code: 'BEARER_TOKEN_NOT_PROVIDED' });
            }
            bearerToken = bearerToken.split(' ')[1];
            const validUser = (0, jsonwebtoken_1.verify)(bearerToken, config_1.env.ACCESS_TOKEN_SECRET);
            if (!validUser)
                (0, http_error_1.HttpError)({ code: 'LOGIN_FAILED' });
            const storedTokenVersion = (0, access_token_version_store_1.getTokenVersion)(validUser.id);
            const storedRefreshTokenVersion = (0, refresh_token_version_store_1.getRefreshTokenVersion)(validUser.id);
            if (validUser.tokenVersion !== storedTokenVersion) {
                (0, http_error_1.HttpError)({ code: 'TOKEN_INVALIDATED' });
            }
            request.user = {
                ...validUser,
                refreshTokenVersion: storedRefreshTokenVersion,
            };
            return requiredRoles?.includes(validUser.role);
        }
        catch (error) {
            if (error.message == 'jwt expired')
                (0, http_error_1.HttpError)({ code: 'JWT_EXPIRED', statusCode: 401 });
            if (error instanceof jsonwebtoken_1.JsonWebTokenError)
                (0, http_error_1.HttpError)({ code: 'JWT_INVALID' });
            throw error;
        }
    }
}
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map