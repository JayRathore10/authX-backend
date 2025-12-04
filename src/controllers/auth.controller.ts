import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";
import { encryptPassword } from "../utils/encryptPassword";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import nodemailer from "nodemailer";
import { config } from "../configs/config";
import { authRequest } from "../types/authRequest";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password || age === undefined) {
      return res.status(401).json({
        message: "Something Wrong happens"
      });
    }

    const userExisted = await userModel.findOne({ email });

    if (userExisted) {
      return res.status(401).json({
        message: "User Already Exist"
      })
    }

    const hashedPassword = await encryptPassword(password);

    const user = await userModel.create({
      name,
      age,
      email,
      password: hashedPassword

    });

    const token = jwt.sign({ email }, config.jwtSecret);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path : "/" , 
      partitioned : true 
    });

    return res.status(200).json({
      message: "User Created",
      user
    })

  } catch (err) {
    return res.status(500).json({
      err
    })
  }
}

export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Something Wrong Happens"
      })
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({
        message: "Wrong Password"
      })
    }

    const token = jwt.sign({ email }, config.jwtSecret);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path : "/" , 
      partitioned: true ,
    });
    return res.status(200).json({
      user
    })

  } catch (err) {
    return res.status(500).json({
      err
    })
  }
}

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({
        message: "Something Wrong Happens"
      })
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpDate = Date.now() + 1000 * 60 * 5;

    await user.save();

    const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.myEmail,
        pass: config.myEmailPassword
      }
    });

    await transporter.sendMail({
      from: "gmail",
      to: user.email,
      subject: "Reset Password",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 5 minutes.</p>
      `,
    })

    return res.status(200).json({
      message: "Password reset link sent to your email"
    })

  } catch (err) {
    return res.status(500).json({
      err
    })
  }
}

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpDate: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      })
    }

    return res.status(200).json({
      message: "Valid token",
      token,
      email: user.email
    })

  } catch (err) {
    return res.status(500).json({
      err
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpDate: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired Token"
      })
    }

    user.password = await encryptPassword(password);
    user.resetToken = "";
    user.resetTokenExpDate = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully"
    })

  } catch (err) {
    return res.status(500).json({ err });
  }
}

export const logOut = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict" ,
      path : "/" , 
      partitioned : true 
    })
    return res.status(200).json({
      message: "Logout Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      err
    })
  }
}
export const changePassword = async (req: authRequest, res: Response) => {
  try {
    const email = req.user?.email;
    const { password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Something Wrong Happens"
      })
    }

    const hashedPassword = await encryptPassword(password);

    user.password = hashedPassword;
    await user.save();

    const token = jwt.sign({ email: user.email }, config.jwtSecret);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,  
      sameSite: "none",   
      path : "/" , 
      partitioned : true 
    });

    return res.status(200).json({
      message: "password change successfully"
    })

  } catch (err) {
    return res.status(500).json({ err })
  }
}