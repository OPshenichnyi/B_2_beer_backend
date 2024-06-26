import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

// Root client type
const rootClient = ["seller", "buyer"];

// email regular expression
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//+ User schema moongose
const userSchema = new Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    clientType: {
      type: String,
      enum: rootClient,
      require: [true, "Select type user"],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);
const User = model("user", userSchema);

export default User;
//+ END User schema Moongose

//+ User schema Joi

export const userSignupSchema = Joi.object({
  userName: Joi.string(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(6).required(),
  clientType: Joi.string().required().messages({
    "any.required": "Please select type user",
  }),
  language: Joi.string(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(6).required(),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
  }),
});
