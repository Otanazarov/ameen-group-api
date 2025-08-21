import { cleanEnv, num, str } from 'envalid';
import { config } from 'dotenv';
config();

export const env = cleanEnv(process.env, {
  PORT: num(),
  ENV: str(),
  BACKEND_URL: str(),
  FRONTEND_URL: str(),

  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  PASSPHRASE: str(),

  TELEGRAM_BOT_TOKEN: str(),
  TELEGRAM_GROUP_ID: str(),

  ATMOS_STORE_ID: str(),
  ATMOS_CONSUMER_KEY: str(),
  ATMOS_CONSUMER_SECRET: str(),

  OCTOBANK_SECRET_KEY: str(),
  OCTOBANK_SHOP_ID: str(),
});
