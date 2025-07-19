"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEncrypted = void 0;
const crypto_js_1 = require("crypto-js");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const MEDIA_UPLOAD_CLIENT = process.env.MEDIA_UPLOAD_CLIENT;
const MEDIA_UPLOAD_SECRET = process.env.MEDIA_UPLOAD_SECRET;
const MEDIA_UPLOAD_KEY = process.env.MEDIA_UPLOAD_KEY;
const handleEncrypted = () => crypto_js_1.AES.encrypt(JSON.stringify({
    client: MEDIA_UPLOAD_CLIENT,
    secret: MEDIA_UPLOAD_SECRET,
    time: Date.now(),
}), MEDIA_UPLOAD_KEY).toString();
exports.handleEncrypted = handleEncrypted;
//# sourceMappingURL=media-upload.utils.js.map