import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { nanoid } from "nanoid";
import { verificationEmailTemplate } from "../email_templates/emailVerifycation.js";

const { JWT_SECRET, BASE_URL } = process.env;

// This is a function for singup in user
const signup = async (req, res) => {
  const { email, password, language, clientType } = req.body;

  // Check if user exist
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already exist");
  }
  console.log(typeof clientType);
  if (clientType !== "seller" && clientType !== "buyer") {
    throw HttpError(
      403,
      "Registration with the specified client type is not allowed"
    );
  }
  // Hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create verification token
  const verificationToken = nanoid();

  // Create new user
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });

  // Select language
  const selectLanguage = language === "en" ? "en" : "ua";

  // Seting up email
  const verifyEmail = {
    to: email,
    subject: "Verifycation your email in B2BEER",
    html: verificationEmailTemplate(
      `${email}`,
      `${BASE_URL}/api/users/verify/${verificationToken}`,
      `${selectLanguage}`
    ),
  };

  // Send email
  await sendEmail(verifyEmail);
  res.status(201).json({
    status: "success",
    message: "Verification your email",
    data: {
      email: newUser.email,
    },
  });
};

// This is a function for singin in user
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(404, "User not found");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  console.log(verificationToken);
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "null",
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verifycation your email in Aplication RETURN BOX",
    html: `<a target ="_blank" Href= "${BASE_URL}/users/verify/${user.verificationToken}">Verification your Email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;
  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const test = async (req, res) => {
  res.json({
    message: "Test",
  });
};
export default {
  signup: ctrlWrapper(signup),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerify: ctrlWrapper(resendVerify),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  test: ctrlWrapper(test),
};
