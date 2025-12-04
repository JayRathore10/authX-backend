import mongoose from "mongoose";

export interface IemailVerficarton{
  email : string  , 
  otp : string , 
  optExpTime : number , 
};

const emailVerifactionSchema = new mongoose.Schema<IemailVerficarton>({ 
  email : String, 
  otp : String , 
  optExpTime : Number 
});

export const emailVerifactionModel = mongoose.model("emailVerifation" , emailVerifactionSchema);

