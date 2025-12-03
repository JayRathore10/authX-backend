"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logOut = exports.resetPassword = exports.verifyResetToken = exports.forgetPassword = exports.logIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const encryptPassword_1 = require("../utils/encryptPassword");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../configs/config");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, age } = req.body;
        if (!name || !email || !password || !age) {
            return res.status(401).json({
                message: "Something Wrong happens"
            });
        }
        const userExisted = yield user_model_1.userModel.findOne({ email });
        if (userExisted) {
            return res.status(401).json({
                message: "User Already Exist"
            });
        }
        const hashedPassword = yield (0, encryptPassword_1.encryptPassword)(password);
        const user = yield user_model_1.userModel.create({
            name,
            age,
            email,
            password: hashedPassword
        });
        const token = jsonwebtoken_1.default.sign({ email }, config_1.config.jwtSecret);
        res.cookie("token", token);
        return res.status(200).json({
            message: "User Created",
            user
        });
    }
    catch (err) {
        return res.status(500).json({
            err
        });
    }
});
exports.signUp = signUp;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something Wrong Happens"
            });
        }
        const user = yield user_model_1.userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        const result = yield bcrypt_1.default.compare(password, user.password);
        if (!result) {
            return res.status(401).json({
                message: "Wrong Password"
            });
        }
        const token = jsonwebtoken_1.default.sign({ email }, config_1.config.jwtSecret);
        res.cookie("token", token);
        return res.status(200).json({
            user
        });
    }
    catch (err) {
        return res.status(500).json({
            err
        });
    }
});
exports.logIn = logIn;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({
                message: "Something Wrong Happens"
            });
        }
        const user = yield user_model_1.userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpDate = Date.now() + 1000 * 60 * 5;
        yield user.save();
        const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: config_1.config.myEmail,
                pass: config_1.config.myEmailPassword
            }
        });
        yield transporter.sendMail({
            from: "gmail",
            to: user.email,
            subject: "Reset Password",
            html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 5 minutes.</p>
      `,
        });
        return res.status(200).json({
            message: "Password reset link sent to your email"
        });
    }
    catch (err) {
        return res.status(500).json({
            err
        });
    }
});
exports.forgetPassword = forgetPassword;
const verifyResetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const user = yield user_model_1.userModel.findOne({
            resetToken: token,
            resetTokenExpDate: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }
        return res.status(200).json({
            message: "Valid token",
            token,
            email: user.email
        });
    }
    catch (err) {
        return res.status(500).json({
            err
        });
    }
});
exports.verifyResetToken = verifyResetToken;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = yield user_model_1.userModel.findOne({
            resetToken: token,
            resetTokenExpDate: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid or expired Token"
            });
        }
        user.password = yield (0, encryptPassword_1.encryptPassword)(password);
        user.resetToken = "";
        user.resetTokenExpDate = undefined;
        yield user.save();
        return res.status(200).json({
            message: "Password reset successfully"
        });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
exports.resetPassword = resetPassword;
const logOut = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
        return res.status(200).json({
            message: "Logout Successfully"
        });
    }
    catch (err) {
        return res.status(500).json({
            err
        });
    }
};
exports.logOut = logOut;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const { password } = req.body;
        const user = yield user_model_1.userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Something Wrong Happens"
            });
        }
        const hashedPassword = yield (0, encryptPassword_1.encryptPassword)(password);
        user.password = hashedPassword;
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ email: user.email }, config_1.config.jwtSecret);
        res.cookie("token", token);
        return res.status(200).json({
            message: "password change successfully"
        });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
exports.changePassword = changePassword;
