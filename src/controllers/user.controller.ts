import { authRequest } from "../types/authRequest";
import { Response } from "express";

export const showProfile = async (req : authRequest , res : Response)=>{
  try{
    const user = req.user;

    if(!user){
      return res.status(401).json({
        message : "Something Wrong happens"
      })
    }
    
    return res.status(200).json({
      user
    })
  }catch(err){
    return res.status(500).json({err});
  }
}