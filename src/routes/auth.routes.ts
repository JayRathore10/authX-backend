import { Router } from "express";
import { forgetPassword, logIn, resetPassword, signUp, verifyResetToken } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/sign-up" , signUp);
authRouter.post("/login", logIn);
authRouter.post("/forget-password" , forgetPassword);
authRouter.post("/reset-password/:token" , resetPassword);
authRouter.get("/reset-password/:token" , verifyResetToken);

