import Router from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {
  acceptConnectionRequest, getConnectionRequests, getConnectionStatus, getUserConnections,
  rejectConnectionRequest, removeConnection, sendConnectionRequest
} from "../controllers/connection.controller.js";

const router = Router();

router.route("/request/:userId").post( protectRoute, sendConnectionRequest);
router.route("/accept/:requestId",).patch( protectRoute, acceptConnectionRequest);
router.route("/reject/:requestId",).patch( protectRoute, rejectConnectionRequest);
router.route("/requests",).get( protectRoute, getConnectionRequests);
router.route("/",).get( protectRoute, getUserConnections);
router.route("/:userId",).delete( protectRoute, removeConnection);
router.route("/status/:userId",).get( protectRoute, getConnectionStatus);

export default router;