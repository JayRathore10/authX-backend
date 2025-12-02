import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async()=>{
  try{
    const mongoUri = config.mongoUri;
    await mongoose.connect(mongoUri);
    console.log("DB Connected Successfully");
  }catch(err){
    console.log(err);
  }
}