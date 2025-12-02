import { Router } from "express";
import { forgetPassword, logIn, logOut, resetPassword, signUp, verifyResetToken } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/sign-up" , signUp);
authRouter.post("/login", logIn);
authRouter.post("/forget-password" , forgetPassword);
authRouter.get("/logout" , logOut);
authRouter.post("/reset-password/:token" , resetPassword);
authRouter.get("/reset-password/:token" , verifyResetToken);

