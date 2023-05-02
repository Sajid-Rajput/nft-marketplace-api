import AppError from "../Utils/appError.js";
import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- GLOBAL ERROR HANDLER ->
//=========================================================================================

const globalErrorHandler = (
  err: AppError,
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  resp.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
};

export default globalErrorHandler;
