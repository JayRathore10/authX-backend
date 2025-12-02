import {Router} from "express";
import { showProfile } from "../controllers/user.controller";
import { isLoggedIn } from "../middleware/auth.middleware";

export const userRouter = Router();

userRouter.get("/profile" , isLoggedIn , showProfile );