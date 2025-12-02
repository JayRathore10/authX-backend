import {  Response , NextFunction } from "express";
import { authRequest, userPlayload } from "../types/authRequest";
import jwt from "jsonwebtoken";
import { config } from "../configs/config";
import { userModel } from "../models/user.model";

export const isLoggedIn = async(req : authRequest , res : Response  , next : NextFunction)=>{
  try{
    const token = req.cookies.token ;

    if(!token){
      return res.status(401).json({
        message : "Login First"
      })
    }

    const decodedData = jwt.verify(token, config.jwtSecret) as userPlayload ;
    
    const user = await userModel.findOne({
      email : decodedData.email
    }).select("-password");

    req.user = user ;
    next();

  }catch(err){
    return res.status(500).json({err})
  }
} 