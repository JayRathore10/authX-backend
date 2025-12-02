import app from "./app";
import { connectDB } from "./configs/db.config";
import dotenv from "dotenv";
import { config } from "./configs/config";

dotenv.config();

const PORT = config.port;

// Connect DB locally 
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
