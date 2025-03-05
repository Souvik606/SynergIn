import Router from "express";
import {getCurrentUser, login, logout, signup} from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup",).post(signup)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/user").get(protectRoute,getCurrentUser)

export default router;