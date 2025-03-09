import express from "express";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';


dotenv.config({
  path:'./.env'
})

const app = express();

if(process.env.NODE_ENV !== "production") {
  app.use(cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"]
    })
  );
}

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "/frontend/dist");
  console.log("Serving frontend from:", frontendPath);

  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

export {app}