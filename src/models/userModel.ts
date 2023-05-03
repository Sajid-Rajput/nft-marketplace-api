import mongoose from "mongoose";
import validator from "../Utils/validator.js";

//=========================================================================================
// <- CREATE USER MODEL MONGOOSE SCHEMA ->
//=========================================================================================

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name!!!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please Provide a valid email address"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password contain atleast 8 characters"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
});

const USER = mongoose.model("User", userSchema);

export default USER;
