import bcrypt from "bcryptjs";
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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (
        this: { password: string },
        password: string
      ): boolean {
        return password === this.password;
      },
      message: "Password is not same",
    },
  },
});

//=========================================================================================
// <- ENCRYPT PASSWORD USING BCRYPT ->
//=========================================================================================

userSchema.pre(
  "save",
  async function (
    this: mongoose.Document & {
      password: string;
      passwordConfirm: string | undefined;
    },
    next
  ) {
    // THE GIVEN IF STATEMENT IS RUNNING ONLY AT THAT TIME WHEN ACCOUNT IS UPDATING TO PASS THE PASSWORD ENCRYPTION PART
    if (!this.isModified("password")) {
      return next();
    }
    // IF THE ABOVE IF STATEMENT IS FALSE THEN THE GIVEN CODE IS RUNNING
    this.password = await bcrypt.hash(this.password, 12);
    // DELETE THE CONFIRM PASSWORD FROM THE DATABASE
    this.passwordConfirm = undefined;
  }
);

//=========================================================================================
// <- COMPARE CANDIDATE AND USER PASSWORD ->
//=========================================================================================

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const USER = mongoose.model("User", userSchema);

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default USER;
