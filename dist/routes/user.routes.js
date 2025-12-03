"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/profile", auth_middleware_1.isLoggedIn, user_controller_1.showProfile);
