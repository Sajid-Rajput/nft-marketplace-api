import USER from "../models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- USER SIGNUP ->
//=========================================================================================

const signup: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const newUser = await USER.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "default-secret",
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    resp.status(201).json({
      status: "Success",
      token,
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
