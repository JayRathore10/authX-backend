import { Router } from "express";
import { logIn, signUp } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/sign-up" , signUp);
authRouter.post("/login", logIn);


