import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail from "../Utils/mail.js";
import USER from "../models/userModel.js";
import AppError from "../Utils/appError.js";
import catchAsync from "../Utils/catchAsync.js";
import { UserDocument } from "../models/userModel.js";
import { Request, Response, NextFunction } from "express";

//=========================================================================================
// <- EXTEND REQUEST OBJECT FOR RESTRICT TO CONTROLLER ->
//=========================================================================================

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
// <- CREATE TOKEN ->
//=========================================================================================

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//=========================================================================================
// <- CREATE SEND TOKEN FUNCTION ->
//=========================================================================================

const createSendToken = (
  user: UserDocument,
  statusCode: number,
  resp: Response
) => {
  const token = signToken(user._id);
  resp.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
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

    createSendToken(newUser, 201, resp);
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
    createSendToken(user, 200, resp);
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
// <- FORGOT PASSWORD ->
//=========================================================================================

const forgotPassword: (
  req: Request,
  resp: Response,
  next: NextFunction
) => void = catchAsync(async (req, resp, next) => {
  // <- *** GET THE BASED ON THE GIVEN EMAIL *** ->
  const user = await USER.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  // <- *** CREATE A RANDOM TOKEN *** ->
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // <- *** SEND PASSWORD RESET EMAIL TO THE USER *** ->
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}\nIf did'nt forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (Valid for 10 minutes)",
      message,
    });

    resp.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email, Try again later", 500)
    );
  }
});

//=========================================================================================
// <- RESET PASSWORD ->
//=========================================================================================

const resetPassword: (
  req: Request,
  resp: Response,
  next: NextFunction
) => void = catchAsync(async (req, resp, next) => {
  // <- *** SEND PASSWORD RESET EMAIL TO THE USER *** ->

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await USER.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // <- *** IF TOKEN HAS EXPIRED OR INVALID TOKEN *** ->
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 404));
  }

  // <- *** UPDATE THE NEW PASSWORD *** ->
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // <- *** LOG THE USER IN AND SEND JWT *** ->
  createSendToken(user, 200, resp);
});

//=========================================================================================
// <- UPDATE PASSWORD ->
//=========================================================================================

const updatePassword: (
  req: Request,
  resp: Response,
  next: NextFunction
) => void = catchAsync(async (req, resp, next) => {
  // <- *** GET USER FROM COLLECTION OF DATA *** ->
  const user = await USER.findById(req.user._id).select("+password");

  // <- *** CHECK IF THE POSTED CURRENT PASSWORD IS CORRECT *** ->
  if (user) {
    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError("Your current password is wrong", 401));
    }

    // <- *** IF SO THEN UPDATE THE PASSWORD *** ->
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // <- *** LOG USER AFTER PASSWORD CHANGE *** ->
    createSendToken(user, 200, resp);
  }
});

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
