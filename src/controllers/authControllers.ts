import USER from "../models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- USER SIGNUP ->
//=========================================================================================

const signup: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const newUser = await USER.create(req.body);

    resp.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  });

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  signup,
};
