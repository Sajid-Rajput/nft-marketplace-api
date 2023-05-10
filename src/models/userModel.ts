import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";
import validator from "../Utils/validator.js";

//=========================================================================================
// <- CREATE USER MODEL MONGOOSE SCHEMA ->
//=========================================================================================

export interface UserDocument extends Document {
  name: string;
  email: string;
  photo?: string;
  role: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: number;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
  createPasswordResetToken(): void;
}

const userSchema = new mongoose.Schema<UserDocument>({
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
  role: {
    type: String,
    enum: ["user", "creater", "admin", "guide"],
    default: "user",
  },
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//=========================================================================================
// <- ENCRYPT PASSWORD USING BCRYPT ->
//=========================================================================================

userSchema.pre<UserDocument>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

//=========================================================================================
// <- ENCRYPT PASSWORD USING BCRYPT ->
//=========================================================================================

userSchema.pre<UserDocument>(
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

//=========================================================================================
// <- VERIFY USER CHANGED PASSWORD OR NOT ->
//=========================================================================================

userSchema.methods.changedPasswordAfter = function (
  this: UserDocument,
  JWTTimeStamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

//=========================================================================================
// <- CREATE RANDOM TOKEN FOR CHANGING PASSWORD ->
//=========================================================================================

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const now = new Date();
  const tenMinutesLater = now.getTime() + 10 * 60 * 1000;
  this.passwordResetExpires = tenMinutesLater;

  return resetToken;
};

const USER = mongoose.model<UserDocument>("User", userSchema);

//=========================================================================================
// <- EXPORTS ->
//=========================================================================================

export default USER;
