import Router from "express"
import {protectRoute} from "../middleware/auth.middleware.js";
import {createPosts, deletePost, getPosts} from "../controllers/post.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router()

router.route("/").get(protectRoute,getPosts)
router.route("/create").post(protectRoute,
  upload.single("postImage"),
  createPosts)
router.route("/delete/:id").delete(protectRoute,deletePost)

export default router