import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

// Have four type users hi have other rules acces:
// provider - owner product,
// customer - sale product owner,
// manager - create orders customer,
// logist - delivery product

const clientType = ["seller", "buyer"];

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
    subscription: {
      type: String,
      enum: clientType,
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
    userPhone: {
      type: String,
    },
    token: String,
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
  clientType: Joi.string()
    .valid(...clientType)
    .required()
    .messages({ "any.required": "Please select type user" }),
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
