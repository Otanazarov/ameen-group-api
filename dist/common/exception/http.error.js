"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = HttpError;
const common_1 = require("@nestjs/common");
function HttpError(error) {
    throw new common_1.HttpException(error?.response ||
        error?.message ||
        error?.code ||
        'Unknown Http Exception', error?.statusCode || common_1.HttpStatus.BAD_REQUEST);
}
//# sourceMappingURL=http.error.js.map