import type { Request } from "express";
import type { Response } from "express";

// ********************************* USER ENDPOINTS ******************************************

//=========================================================================================
// <- GET ALL USERS ->
//=========================================================================================

const getAllUsers: (req: Request, resp: Response) => void = (req, resp) => {
  resp.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

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
