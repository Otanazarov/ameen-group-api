"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const envalid_1 = require("envalid");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.env = (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, envalid_1.num)(),
    ENV: (0, envalid_1.str)(),
    BACKEND_URL: (0, envalid_1.str)(),
    FRONTEND_URL: (0, envalid_1.str)(),
    ACCESS_TOKEN_SECRET: (0, envalid_1.str)(),
    REFRESH_TOKEN_SECRET: (0, envalid_1.str)(),
    PASSPHRASE: (0, envalid_1.str)(),
    TELEGRAM_BOT_TOKEN: (0, envalid_1.str)(),
    TELEGRAM_GROUP_ID: (0, envalid_1.str)(),
    ATMOS_STORE_ID: (0, envalid_1.str)(),
    ATMOS_CONSUMER_KEY: (0, envalid_1.str)(),
    ATMOS_CONSUMER_SECRET: (0, envalid_1.str)(),
    OCTOBANK_SECRET_KEY: (0, envalid_1.str)(),
    OCTOBANK_SHOP_ID: (0, envalid_1.str)(),
});
//# sourceMappingURL=index.js.map