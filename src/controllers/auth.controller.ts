import { Request , Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";
import { encryptPassword } from "../utils/encryptPassword";
import bcrypt from 'bcrypt';

export const signUp = async(req : Request , res : Response)=>{
  try{
    const {name , email , password , age} = req.body;

    if(!name || !email || !password || !age){
      return res.status(401).json({
        message : "Something Wrong happens"
      });
    }

    const userExisted = await userModel.findOne({email});

    if(userExisted){
      return res.status(401).json({
        message : "User Already Exist"
      })
    }

    const hashedPassword  = await encryptPassword(password);

    const user = await userModel.create({
      name , 
      age , 
      email , 
      password : hashedPassword

    });

    const token = jwt.sign({email} , "secure");

    res.cookie("token" , token);

    return res.status(200).json({
      message : "User Created" , 
      user 
    })

  }catch(err){
    return res.status(500).json({
      err
    })
  }
}

export const logIn = async(req : Request, res : Response)=>{
  try{
    const {email , password} = req.body;

    if(!email || !password){
      return res.status(401).json({
        message : "Something Wrong Happens"
      })
    }

    const user = await userModel.findOne({email});

    if(!user){
      return res.status(401).json({
        message : "User not found"
      })
    }

    const result = await bcrypt.compare(password , user.password);

    if(!result){
      return res.status(401).json({
        message : "Wrong Password"
      })
    }

    const token = jwt.sign({email} , "secure");

    res.cookie("token" , token);
    return res.status(200).json({
      user
    })

  }catch(err){
    return res.status(500).json({
      err
    })
  }
}