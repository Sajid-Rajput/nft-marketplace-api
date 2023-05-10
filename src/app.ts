import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import { dirname } from "path";
import xssClean from "xss-clean";
import { fileURLToPath } from "url";
import type { Express } from "express";
import AppError from "./Utils/appError.js";
import { rateLimit } from "express-rate-limit";
import nftsRouter from "./routes/nftsRoute.js";
import usersRouter from "./routes/usersRoute.js";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { Request, Response, NextFunction } from "express";
import globalErrorHandler from "./controllers/errorControllers.js";

const app: Express = express();

//=========================================================================================
// <- EXPRESS MIDDLEWARE(SET CALL API RATE LIMIT TO A SPECIFIC IP ) ->
//=========================================================================================

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hous",
});

app.use("/api", limiter);

//=========================================================================================
// <- EXPRESS MIDDLEWARE ->
//=========================================================================================

app.use(express.json({ limit: "10kb" })); // <- Express Middleware ->

//=========================================================================================
// <- DATA SANITIZATION AGAINST NOSQL QUERY INJECTION ->
//=========================================================================================

app.use(ExpressMongoSanitize());

//=========================================================================================
// <- DATA SANITIZATION AGAINST SITE SCRIPT XSS ->
//=========================================================================================

app.use(xssClean());

//=========================================================================================
// <- SECURE HTTP HEADER USING HELMET ->
//=========================================================================================

app.use(helmet());

//=========================================================================================
// <- MORGAN PACKAGE FOR SEE API CALLS IN TERMINAL ->
//=========================================================================================

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//=========================================================================================
// <- SERVING TEMPLATE DEMO ->
//=========================================================================================

app.use(
  express.static(
    path.join(dirname(fileURLToPath(import.meta.url)), "..", "nft-data", "img")
  )
);

//=========================================================================================
// <- BUILD CUSTOM EXPRESS MIDDLEWARES ->
//=========================================================================================

app.use((req, resp, next) => {
  console.log(`Hello👋! I am from middleware function`);
  next();
});

// <- ADDING REQUEST TIME PARAMETER IN EXPRESS ->

// declare global {
//   namespace Express {
//     interface Request {
//       requestTime?: string;
//     }
//   }
// }

// app.use((req, resp, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

//=========================================================================================
// <- API ROUTES ->
//=========================================================================================

// *** EXPRESS ROUTER ***

// *** EXPRESS ROUTER MIDDLEWARE ***
app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

//=========================================================================================
// <- ERROR HANDLING ->
//=========================================================================================

// *** GLOBAL ERROR HANDLER ***
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(globalErrorHandler);

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default app;
