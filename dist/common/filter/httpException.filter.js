"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestExceptionFilter = exports.HttpExceptionFilter = exports.getStatusCode = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const core_response_1 = require("../response/core.response");
const getStatusCode = (exception) => {
    return exception instanceof common_2.HttpException
        ? exception.getStatus()
        : common_2.HttpStatus.INTERNAL_SERVER_ERROR;
};
exports.getStatusCode = getStatusCode;
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if ((0, class_validator_1.isObject)(exception.response)) {
            exception.response.path = request.path;
            exception.response.method = request.method;
        }
        const code = (0, exports.getStatusCode)(exception);
        if (code >= 500) {
            console.error(exception);
        }
        if (!response.status) {
            console.log(exception);
            return;
        }
        response.status(code).json(core_response_1.CoreApiResponse.error({
            message: exception?.message || exception?.response || exception,
        }));
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
let BadRequestExceptionFilter = class BadRequestExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if ((0, class_validator_1.isObject)(exception.response)) {
            exception.response.path = request.path;
            exception.response.method = request.method;
        }
        const code = (0, exports.getStatusCode)(exception);
        if (code >= 500) {
            console.error(exception);
        }
        response.status(code).json(core_response_1.CoreApiResponse.error({
            message: exception?.response || exception?.message || exception,
        }));
    }
};
exports.BadRequestExceptionFilter = BadRequestExceptionFilter;
exports.BadRequestExceptionFilter = BadRequestExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.BadRequestException)
], BadRequestExceptionFilter);
//# sourceMappingURL=httpException.filter.js.map