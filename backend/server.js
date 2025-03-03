import dotenv from "dotenv";
import {app} from "./app.js";
import {connectDB} from "./lib/db.js";

dotenv.config({
  path:'./.env'
})

connectDB().then(
  ()=>{
    app.on("error", (error)=>{
      console.log(error);
      throw error;
    });

    app.listen(process.env.PORT || 5000,()=>{
      console.log(`Server started on port ${process.env.PORT || 5000}`);
    })
  }
).catch((err)=>{console.log("MongoDB connection error: ", err)})