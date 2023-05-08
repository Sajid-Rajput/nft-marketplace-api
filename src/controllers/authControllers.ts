import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import USER from "../models/userModel.js";
import AppError from "../Utils/appError.js";
import catchAsync from "../Utils/catchAsync.js";
import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- USERDOCUMENT INTERFACE FOR LOGIN CONTROLLER ->
//=========================================================================================

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

//=========================================================================================
// <- CREATE TOKEN ->
//=========================================================================================

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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

    const token = signToken(newUser._id);

    resp.status(201).json({
      status: "Success",
      token,
      data: {
        user: newUser,
      },
    });
  });

//=========================================================================================
// <- LOGIN USER ->
//=========================================================================================

const login: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide your email and password", 401));
    }

    const user = (await USER.findOne({ email }).select(
      "+password"
    )) as UserDocument | null;

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email and password", 401));
    }
    const token = signToken(user.id);
    resp.status(200).json({
      status: "success",
      token,
    });
  });

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  signup,
  login,
};
