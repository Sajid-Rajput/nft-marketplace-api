import express from "express";
import type { Router } from "express";
import userControllers from "../controllers/userControllers.js";

//=========================================================================================
// <- ROUTER USERS ->
//=========================================================================================

// *** EXPRESS ROUTER ***
const router: Router = express.Router();

// *** USERS ROUTES ***

router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route("/:id")
  .get(userControllers.getSingleUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default router;
