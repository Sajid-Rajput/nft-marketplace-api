//=========================================================================================
// <- EXTENDING ERROR OBJECT(CLASS) ->
//=========================================================================================

export default class AppError extends Error {
  public status: string;
  public statusCode: number;
  public isOperational: boolean;
  path?: string;
  value?: string;
  code?: number;
  keyValue?: { name: string };
  errors?: { [s: string]: unknown; } | ArrayLike<unknown>;

  constructor(message: string, statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
