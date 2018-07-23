import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Express } from "express";

export const withCompression = (expressApp: Express) =>
  expressApp.use(compression());

export const withCors = (expressApp: Express) =>
  expressApp.use(
    cors({
      origin: "http://localhost:3000",
    }),
  );

export const withCookieParser = (expressApp: Express) =>
  expressApp.use(cookieParser());

export default (expressApp: Express) => {
  withCompression(expressApp);
  withCors(expressApp);
  withCookieParser(expressApp);
  return expressApp;
};
