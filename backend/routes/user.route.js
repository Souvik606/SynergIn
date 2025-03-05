import Router from "express"
import {protectRoute} from "../middleware/auth.middleware.js";
import {getProfile, getSuggestedConnections} from "../controllers/user.controller.js";

const router = Router();

router.route("suggestions").get(protectRoute,getSuggestedConnections);
router.route("/:username").get(protectRoute,getProfile);
router.route("/update-profile").patch(protectRoute)

export default router;