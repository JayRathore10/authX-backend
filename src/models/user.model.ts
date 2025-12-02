import mongoose  from "mongoose";

export interface Iuser{
  name : string , 
  email : string , 
  password : string  , 
  age : number
};

const userSchema = new mongoose.Schema<Iuser>({
  name : String , 
  email : String , 
  password : String , 
  age : Number
});

export const userModel = mongoose.model("user" , userSchema);