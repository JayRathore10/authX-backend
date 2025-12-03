import cookieParser from "cookie-parser";
import express  , {Request , Response} from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use("/api/auth" , authRouter);
app.use("/api/user" , userRouter);

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

export default app;
