import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();
const port = process.env.PORT || 5000;

app.use("api/v1/auth", authRoutes);
app.use(express.json());
export {app}