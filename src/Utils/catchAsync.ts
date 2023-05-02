import { Request, Response, NextFunction } from "express";

const catchAsync = <T extends (...args: any[]) => Promise<any>>(myFunc: T) => {
  return (req: Request, resp: Response, next: NextFunction) => {
    myFunc(req, resp, next).catch(next);
  };
};

export default catchAsync;
