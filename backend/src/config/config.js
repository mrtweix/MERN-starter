import dotenv from 'dotenv';

dotenv.config({});

const DEFAULT_PORT = 5001;

const config = {
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || DEFAULT_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  BASE_PATH: process.env.BASE_PATH,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  VERIFY_EMAIL_TOKEN: process.env.VERIFY_EMAIL_TOKEN,
  RESET_PASSWORD_TOKEN: process.env.RESET_PASSWORD_TOKEN,
  JWT_REFRESH_EXPIRATION_DAYS: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  JWT_ACCESS_EXPIRATION_TIME: process.env.JWT_ACCESS_EXPIRATION_TIME,
  JWT_RESET_PASSWORD_EXPIRATION_DAYS: process.env.JWT_RESET_PASSWORD_EXPIRATION_DAYS,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FRONTEND_HOST: process.env.FRONTEND_HOST
};

export default config;
