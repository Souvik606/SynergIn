import mongoose from "mongoose";

export const connectDB=async () => {
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Mongo DB ${conn.connection.host}`);
  }
  catch(err){
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
}