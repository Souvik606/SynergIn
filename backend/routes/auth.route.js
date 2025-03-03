import Router from "express";
import {login, logout, signup} from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup",).post(signup)
router.post("/login",login)
router.post("/logout",logout)

export default router;