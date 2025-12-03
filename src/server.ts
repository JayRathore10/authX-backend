import app from "./app";
import { connectDB } from "./configs/db.config";

// Connect DB locally 
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
