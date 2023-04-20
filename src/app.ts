import morgan from "morgan";
import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import nftsRouter from "./routes/nftsRoute.js";
import usersRouter from "./routes/usersRoute.js";
import type { Express } from "express";

const app: Express = express();

//=========================================================================================
// <- EXPRESS MIDDLEWARE ->
//=========================================================================================

app.use(express.json()); // <- Express Middleware ->

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
// <- EXPORTS ->
//=========================================================================================

export default app;
