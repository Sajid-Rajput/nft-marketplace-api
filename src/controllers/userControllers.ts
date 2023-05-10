import USER from "../models/userModel.js";
import AppError from "../Utils/appError.js";
import catchAsync from "../Utils/catchAsync.js";
import APIFeatures from "../Utils/apiFeatures.js";
import type { Request, Response, NextFunction } from "express";

// ********************************* USER ENDPOINTS ****************************************

//=========================================================================================
// <- FILTER OBJECT FUNCTION ->
//=========================================================================================

const filterObj = (obj: Request["body"], ...allowedFields: string[]) => {
  const newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach((element) => {
    if (allowedFields.includes(element)) {
      newObj[element] = obj[element];
    }
  });

  return newObj;
};

//=========================================================================================
// <- UPDATE CURRENT USER DATA ->
//=========================================================================================

const updateMe: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    // <- *** CREATE ERROR IF USER UPDATING PASSWORD *** ->
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is for password update. Please use /updateMyPassword",
          400
        )
      );
    }

    // <- *** UPDATE USER DATA *** ->
    const filteredBody = filterObj(req.body, "name", "email");

    const updateUser = await USER.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    resp.status(200).json({
      status: "success",
      data: {
        user: updateUser,
      },
    });
  });

//=========================================================================================
// <- CURRENT USER DELETE THE ACCOUNT ->
//=========================================================================================

const deleteMe: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp, next) => {
    console.log(req);
    await USER.findByIdAndUpdate(req.user._id, { active: false });

    resp.status(204).json({
      status: "success",
      data: null,
    });
  });

//=========================================================================================
// <- GET ALL USERS ->
//=========================================================================================

const getAllUsers: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp) => {
    const userFeatures: APIFeatures = new APIFeatures(USER.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    const users = await userFeatures["query"];

    resp.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  });

//=========================================================================================
// <- CREATE USER ->
//=========================================================================================

const createUser: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

//=========================================================================================
// <- GET SINGLE USER ->
//=========================================================================================

const getSingleUser: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

//=========================================================================================
// <- UPDATE USER ->
//=========================================================================================

const updateUser: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

//=========================================================================================
// <- DELETE USER ->
//=========================================================================================

const deleteUser: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

// ********************************* USER ENDPOINTS ****************************************

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
