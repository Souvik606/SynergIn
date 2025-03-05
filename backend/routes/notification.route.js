import Router from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {deleteNotification, getNotifications, markNotificationRead} from "../controllers/notification.controller.js";

const router = Router();

router.route("/").get(protectRoute,getNotifications)
router.route("/:id/read").patch(protectRoute,markNotificationRead)
router.route("/delete/:id").delete(protectRoute,deleteNotification)

export default router;