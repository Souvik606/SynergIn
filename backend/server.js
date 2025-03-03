import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use("api/v1/auth", authRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));