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

// *** FORGOT PASSWAORD ROUTE ***
router.post("/forgotPassword", authControllers.forgotPassword);

// *** RESET PASSWORD ROUTE ***
router.patch("/resetPassword/:token", authControllers.resetPassword);

// *** RESET PASSWORD ROUTE ***
router.patch(
  "/updateMyPassword",
  authControllers.protect,
  authControllers.updatePassword
);

// *** UPDATE CURRENT USER DATA ROUTE ***
router.patch("/updateMe", authControllers.protect, userControllers.updateMe);

// *** CURRENT USER DELETE ACCOUNT ***
router.delete("/deleteMe", authControllers.protect, userControllers.deleteMe);

// *** USERS ROUTES ***

router
  .route("/")
  .get(
    authControllers.protect,
    authControllers.restrictTo("admin", "guide"),
    userControllers.getAllUsers
  )
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin", "guide"),
    userControllers.createUser
  );

router
  .route("/:id")
  .get(
    authControllers.protect,
    authControllers.restrictTo("admin", "guide"),
    userControllers.getSingleUser
  )
  .patch(
    authControllers.protect,
    authControllers.restrictTo("admin", "guide"),
    userControllers.updateUser
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin", "guide"),
    userControllers.deleteUser
  );

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default router;
