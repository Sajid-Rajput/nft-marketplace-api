import USER from "../models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import type { Request, Response, NextFunction } from "express";

// ********************************* USER ENDPOINTS ******************************************

//=========================================================================================
// <- GET ALL USERS ->
//=========================================================================================

const getAllUsers: (req: Request, resp: Response, next: NextFunction) => void =
  catchAsync(async (req, resp) => {
    const users = await USER.find();

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

// ********************************* USER ENDPOINTS ******************************************

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
