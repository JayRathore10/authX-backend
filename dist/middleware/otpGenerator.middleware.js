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
const resend_1 = require("resend");
// export const otpGenerator = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }
//     await emailVerifactionModel.deleteOne({ email });
//     const otp = crypto.randomInt(1000, 9999).toString();
//     await emailVerifactionModel.create({
//       otp,
//       email,
//       optExpTime: Date.now() + 5 * 60 * 1000
//     });
//     const verifyLink = `https://authx-backend-yyep.onrender.com/api/auth/verify-otp/${otp}`
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: config.myEmail,
//         pass: config.myEmailPassword,
//       },
//     })
//     await transporter.sendMail({
//       from: config.myEmail,
//       to: email,
//       subject: "OTP Verification",
//       html: `
//         <h3>OTP Verification</h3>
//         <p>Click the link below to get your OTP</p>
//         <a href="${verifyLink}">${verifyLink}</a>
//         <p>This link will expire in 5 minutes.</p>
//       `,
//     })
//     return res.status(200).json({ message: "Otp sended" })
//   } catch (err) {
//     return res.status(500).json({ err });
//   }
// }
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const otpGenerator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const otp = crypto_1.default.randomInt(1000, 9999).toString();
        yield emailVerfication_model_1.emailVerifactionModel.deleteOne({ email });
        yield emailVerfication_model_1.emailVerifactionModel.create({
            otp,
            email,
            optExpTime: Date.now() + 5 * 60 * 1000
        });
        const verifyLink = `https://authx-backend-yyep.onrender.com/api/auth/verify-otp/${otp}`;
        yield resend.emails.send({
            from: "AuthX <onboarding@resend.dev>",
            to: email,
            subject: "OTP Verification",
            html: `<a href="${verifyLink}">${verifyLink}</a>`,
        });
        return res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Email service failed" });
    }
});
exports.otpGenerator = otpGenerator;
