import { Router } from "express";
import { changePassword, checkOtp, forgetPassword, isUserExist, logIn, logOut, resetPassword, signUp, verifyOTP, verifyResetToken } from "../controllers/auth.controller";
import { isLoggedIn } from "../middleware/auth.middleware";
import { otpGenerator } from "../middleware/otpGenerator.middleware";

export const authRouter = Router();

authRouter.post("/sign-up" , signUp);
authRouter.post("/login", logIn);
authRouter.post("/forget-password" , forgetPassword);
authRouter.post("/user-exist" , isUserExist);
authRouter.post("/otp-generator" , otpGenerator , checkOtp);
authRouter.post("/change-password", isLoggedIn , changePassword);
authRouter.get("/logout" , isLoggedIn , logOut);
authRouter.post("/reset-password/:token" , resetPassword);
authRouter.get("/reset-password/:token" , verifyResetToken);
authRouter.get("/verify-otp/:otp" ,verifyOTP);

