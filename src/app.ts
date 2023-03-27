import morgan from "morgan";
import express from "express";
import nftsRouter from "./routes/nftsRoute.js";
import usersRouter from "./routes/usersRoute.js";
import type { Express } from "express";

const app: Express = express();

//=========================================================================================
// <- EXPRESS MIDDLEWARE ->
//=========================================================================================

app.use(express.json()); // <- Express Middleware ->
app.use(morgan("dev"));

//=========================================================================================
// <- BUILD CUSTOM EXPRESS MIDDLEWARES ->
//=========================================================================================

app.use((req, resp, next) => {
  console.log(`Hello👋! I am from middleware function`);
  next();
});

app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

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
