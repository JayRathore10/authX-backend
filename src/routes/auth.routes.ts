import { Router } from "express";
import { changePassword, forgetPassword, logIn, logOut, resetPassword, signUp, verifyOTP, verifyResetToken } from "../controllers/auth.controller";
import { isLoggedIn } from "../middleware/auth.middleware";
import { isUserExist } from "../middleware/isUserExist.middleware";
import { otpGenerator } from "../middleware/otpGenerator.middleware";

export const authRouter = Router();

authRouter.post("/sign-up" ,isUserExist  , otpGenerator , signUp);
authRouter.post("/login", logIn);
authRouter.post("/forget-password" , forgetPassword);
authRouter.get("/logout" , isLoggedIn , logOut);
authRouter.post("/change-password", isLoggedIn , changePassword);
authRouter.post("/otp-generator" , otpGenerator , verifyOTP);
authRouter.post("/reset-password/:token" , resetPassword);
authRouter.get("/reset-password/:token" , verifyResetToken);
authRouter.get("/verify-otp/:otp" ,verifyOTP);

