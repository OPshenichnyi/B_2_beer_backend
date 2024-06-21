import express from "express";
import * as userSchemas from "../models/User.js";
import { validateBody } from "../decorators/index.js";
import authControler from "../controllers/auth-controler.js";
import { authenticate } from "../middlewares/index.js";

const authRouter = express.Router();
const userSignupValidate = validateBody(userSchemas.userSignupSchema);
const userSigninValidate = validateBody(userSchemas.userSigninSchema);
const userRefreshValidate = validateBody(userSchemas.userVerifySchema);

authRouter.post("/register", userSignupValidate, authControler.signup);
authRouter.get("/verify/:verificationToken", authControler.verifyEmail);
authRouter.post("/verify", userRefreshValidate, authControler.resendVerify);
authRouter.post("/login", userSigninValidate, authControler.signin);
authRouter.get("/current", authenticate, authControler.getCurrent);
authRouter.post("/logout", authenticate, authControler.signout);
authRouter.post("/test", authControler.test);

export default authRouter;

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
