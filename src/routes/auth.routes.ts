import { Router } from "express";
import { changePassword, forgetPassword, logIn, logOut, resetPassword, signUp, verifyResetToken } from "../controllers/auth.controller";
import { isLoggedIn } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/sign-up" , signUp);
authRouter.post("/login", logIn);
authRouter.post("/forget-password" , forgetPassword);
authRouter.get("/logout" , isLoggedIn , logOut);
authRouter.post("/change-password", isLoggedIn , changePassword);
authRouter.post("/reset-password/:token" , resetPassword);
authRouter.get("/reset-password/:token" , verifyResetToken);

