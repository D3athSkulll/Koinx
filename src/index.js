import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db.js";
import { PORT } from "./constants.js";

dotenv.config({
  path: "./.env",
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err)=>{
  console.log("MongoDB connection failed : ",err);
});
