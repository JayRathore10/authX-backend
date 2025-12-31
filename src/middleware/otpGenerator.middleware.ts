  import { Request, Response, NextFunction } from "express";
  import { emailVerifactionModel } from "../models/emailVerfication.model";
  import crypto from "crypto";
  import { encryptPassword } from "../utils/encryptPassword";
  import nodemailer from 'nodemailer';
  import { config } from "../configs/config";
  import { userModel } from "../models/user.model";

  export const otpGenerator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      await emailVerifactionModel.deleteOne({ email });

      const otp = crypto.randomInt(1000, 9999).toString();

      await emailVerifactionModel.create({
        otp,
        email,
        optExpTime: Date.now() + 5 * 60 * 1000
      });

      const verifyLink = `https://authx-backend-yyep.onrender.com/api/auth/verify-otp/${otp}`

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.myEmail,
          pass: config.myEmailPassword,
        },
      })

      await transporter.sendMail({
        from: config.myEmail,
        to: email,
        subject: "OTP Verification",
        html: `
          <h3>OTP Verification</h3>
          <p>Click the link below to get your OTP</p>
          <a href="${verifyLink}">${verifyLink}</a>
          <p>This link will expire in 5 minutes.</p>
        `,
      })

      return res.status(200).json({ message: "Otp sended" })

    } catch (err) {
      return res.status(500).json({ err });
    }
  }