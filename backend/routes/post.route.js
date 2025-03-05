import Router from "express"
import {protectRoute} from "../middleware/auth.middleware.js";
import {
  createComment,
  createPosts,
  deletePost,
  getFeedPosts,
  getPostById,
  likePost
} from "../controllers/post.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router()

router.route("/").get(protectRoute,getFeedPosts)
router.route("/create").post(protectRoute,
  upload.single("image"),
  createPosts)
router.route("/delete/:id").delete(protectRoute,deletePost)
router.route("/:id").get(protectRoute,getPostById)
router.route("/:id/comment").post(protectRoute,createComment)
router.route("/:id/like").post(protectRoute,likePost)

export default router