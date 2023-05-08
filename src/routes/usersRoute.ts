import express from "express";
import type { Router } from "express";
import userControllers from "../controllers/userControllers.js";
import authControllers from "../controllers/authControllers.js";

//=========================================================================================
// <- ROUTER USERS ->
//=========================================================================================

// *** EXPRESS ROUTER ***
const router: Router = express.Router();

// *** SIGNUP ROUTE ***
router.post("/signup", authControllers.signup);

// *** LOGIN ROUTE ***
router.post("/login", authControllers.login);

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
