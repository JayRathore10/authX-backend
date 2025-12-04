import mongoose  from "mongoose";
import { Document } from "mongoose";

export interface Iuser extends Document{
  name : string , 
  email : string , 
  password : string  , 
  age : number , 
  resetToken : string , 
  resetTokenExpDate?:  number 
};

const userSchema = new mongoose.Schema<Iuser>({
  name : String , 
  email : String , 
  password : String , 
  age : Number , 
  resetToken : String, 
  resetTokenExpDate : Number,
});

export const userModel = mongoose.model("user" , userSchema);