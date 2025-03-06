import Router from "express"
import {protectRoute} from "../middleware/auth.middleware.js";
import {getProfile, getSuggestedConnections, updateProfile} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router();

router.route("/suggestions").get(protectRoute,getSuggestedConnections);
router.route("/:username").get(protectRoute,getProfile);
router.route("/update-profile").patch(protectRoute,
  upload.fields([
    {
      name:"profilePicture",
      maxCount:1,
    },
    {
      name:"bannerImg",
      maxCount:1,
    }
    ]),
  updateProfile
  )

export default router;