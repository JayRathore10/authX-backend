import { Request , Response , NextFunction } from "express";
import { emailVerifactionModel } from "../models/emailVerfication.model";
import crypto from "crypto";
import { userModel } from "../models/user.model";

export const isUserExist = async(req : Request , res : Response, next : NextFunction)=>{
  try{

    const {email , name , age , password} = req.body;

    if(!email || age === undefined || !name || !password){
      return res.status(401).json({
        message : ' Something Wrong Happens'
      });
    }

    const user = await userModel.findOne({email});

    if(user){
      return res.status(401).json({
        message : "User Already Exist"
      })
    }

    next();
  }catch(err){
    return res.status(500).json({err});
  }
}