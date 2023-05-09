import { measureMemory } from "vm";
import AppError from "../Utils/appError.js";
import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- GLOBAL ERROR HANDLER ->
//=========================================================================================

// <- DEVELOPMENT ERROR RESPONSE FUNCTION ->
function sendErrorDev(err: AppError, resp: Response): void {
  resp.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

// <- PRODUCTION ERROR RESPONSE FUNCTION ->
function sendErrorPro(err: AppError, resp: Response): void {
  if (err.isOperational) {
    resp.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    resp.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}

// <- HANDLE CASTERROR ->

function handleCastErrorDB(err: AppError): AppError {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

// <- DUPLICATE FIELDS FUNCTION ->

function handleDuplicateFieldsDB(err: AppError): AppError {
  const value = err.keyValue?.name;
  const message = `Duplicate field values '${value}'. Please use another value`;
  return new AppError(message, 400);
}

// <- VALIDATION ERROR FUNCTION ->

function handleValidationError(err: AppError): AppError {
  if (!err.errors) {
    return new AppError("Validation error", 400);
  }
  const errors = Object.values(err.errors).map((elem: any) => elem.message);
  const message = `Invalid Input Data. ${errors.join(". ")}`;
  return new AppError(message, 400);
}

// <- JWT(JSON-WEB-TOKEN) ERROR FUNCTION ->
function handleJWTError(): AppError {
  const message = "Invalid token, Please log in again";
  return new AppError(message, 401);
}

// <- JWT(JSON-WEB-TOKEN) EXPIRED ERROR FUNCTION ->
function handleJWTExpiredError(): AppError {
  const message = "Your token got expired. Please login again";
  return new AppError(message, 401);
}

const globalErrorHandler = (
  err: AppError,
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, resp);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (err.name === "ValidationError") {
      error = handleValidationError(error);
    } else if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    } else if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorPro(error, resp);
  }

  next();
};

export default globalErrorHandler;
