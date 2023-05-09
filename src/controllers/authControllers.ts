import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import USER from "../models/userModel.js";
import AppError from "../Utils/appError.js";
import catchAsync from "../Utils/catchAsync.js";
import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- EXTEND REQUEST OBJECT FOR RESTRICT TO CONTROLLER ->
//=========================================================================================

interface UserDocument extends Document {
  name: string;
  email: string;
  photo?: string;
  role: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
}

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

//=========================================================================================
// <- DECODED-TOKEN INTERFACE ->
//=========================================================================================
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

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
    const newUser = await USER.create(req.body);
    // const newUser = await USER.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    //   passwordConfirm: req.body.passwordConfirm,
    // });

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
// <- PROTECTING DATA ->
//=========================================================================================

const protect: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    // <- *** CHECK TOKEN *** ->
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in to get access", 401));
    }

    // <- *** VALIDATING TOKEN *** ->
    const verifyToken = (token: string, secret: string) =>
      new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) reject(err);
          resolve(decoded);
        });
      });

    const decode = (await verifyToken(
      token,
      process.env.JWT_SECRET || "default-secret"
    )) as DecodedToken;

    // <- *** USER EXIST *** ->
    const currentUser = await USER.findById({ _id: decode.id });

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token is no longer exists.",
          401
        )
      );
    }

    // <- *** CHANGE PASSWORD *** ->
    if (currentUser.changedPasswordAfter(decode.iat)) {
      return next(new AppError("User recently changed the password.", 401));
    }

    // <- *** USER WILL HAVA ACCESS THE PROTECTING DATA *** ->
    req.user = currentUser;

    next();
  });

//=========================================================================================
// <- CHECK THE USER ROLE ->
//=========================================================================================

const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, resp: Response, next: NextFunction) => {
    console.log("Hello World");
    console.log(req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You have no acces to delete NFT", 403));
    }
    next();
  };
};
//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  signup,
  login,
  protect,
  restrictTo,
};
