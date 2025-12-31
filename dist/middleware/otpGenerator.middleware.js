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
exports.otpGenerator = void 0;
const emailVerfication_model_1 = require("../models/emailVerfication.model");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../configs/config");
const otpGenerator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(500).json({ message: "Something Wrong Happens" });
        }
        yield emailVerfication_model_1.emailVerifactionModel.deleteOne({ email });
        const otp = crypto_1.default.randomInt(1000, 9999).toString();
        yield emailVerfication_model_1.emailVerifactionModel.create({
            otp,
            email,
            optExpTime: Date.now() + 5 * 60 * 1000
        });
        const verifyLink = `https://authx-backend-yyep.onrender.com/api/auth/verify-otp/${otp}`;
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
            to: email,
            subject: "OTP Verification",
            html: `
        <h3>OTP Verification</h3>
        <p>Click the link below to get your OTP</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>This link will expire in 5 minutes.</p>
      `,
        });
        next();
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
exports.otpGenerator = otpGenerator;
