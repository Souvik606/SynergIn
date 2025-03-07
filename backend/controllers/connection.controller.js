import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notifications.model.js";
import {User} from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {sendConnectionAcceptedEmail} from "../email/emailHandler.js";

export const sendConnectionRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params.userId;
    const senderId = req.user._id;

    if (senderId.toString() === userId) {
      throw new ApiError(400,"You can't send a request to yourself")
    }

    if (req.user.connections.includes(userId)) {
      throw new ApiError(400,"You are already connected")
    }

    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });

    if (existingRequest) {
      throw new ApiError(400,"A connection request already exists")
    }

    const newRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
    });

    const connection=await newRequest.save({validateBeforeSave:false});

    return res.status(201).json(
      new ApiResponse(201,connection,"Connection request sent successfully")
    )
});

export const acceptConnectionRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params.requestId;
    const userId = req.user._id;

    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name email username")
      .populate("recipient", "name username");

    if (!request) {
      throw new ApiError(404,"No connection request found.")
    }

    if (request.recipient._id.toString() !== userId.toString()) {
      throw new ApiError(400,"Not authorized to accept this request")
    }

    if (request.status !== "pending") {
      throw new ApiError(400,"This request has already been processed" )
    }

    request.status = "accepted";
    const acceptedRequest=await request.save({validateBeforeSave:false});

    await User.findByIdAndUpdate(request.sender._id, { $addToSet: { connections: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } });

    const notification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    await notification.save();

    res.status(200).json(
      new ApiResponse(200,acceptedRequest,"Connection accepted successfully")
    )

    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

  try {
    await sendConnectionAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);
  } catch (error) {
    console.error("Error in sendConnectionAcceptedEmail:", error);
  }
});

export const rejectConnectionRequest =asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await ConnectionRequest.findById(requestId);

    if (request.recipient.toString() !== userId.toString()) {
      throw new ApiError(400,"Not authorized to reject this request")
    }

    if (request.status !== "pending") {
      throw new ApiError(400,"This request has already been processed" )
    }

    request.status = "rejected";
    const rejectedRequest=await request.save();

    return res.status(200).json(
      new ApiResponse(200,rejectedRequest,"Connection rejected successfully")
    )
});

export const getConnectionRequests =asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({ recipient: userId, status: "pending" }).populate(
      "sender",
      "name username profilePicture headline connections"
    );

    return res.status(200).json(
      new ApiResponse(200, requests,"Connection requests fetched successfully")
    )
});

export const getUserConnections = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const userConnections = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline connections"
    );

    return res.status(200).json(
      new ApiResponse(200, userConnections,"Connections fetched successfully")
    )
});

export const removeConnection = asyncHandler(async (req, res) => {
    const myId = req.user._id;
    const { userId } = req.params.userId;

    const updatedConnections=await User.findByIdAndUpdate(myId, { $pull: { connections: userId } },{new:true});
    await User.findByIdAndUpdate(userId, { $pull: { connections: myId } },{new:true});

    if(!updatedConnections){
      throw new ApiError(400,"Invalid user id")
    }

    return res.status(200).json(
      new ApiResponse(200, updatedConnections,"Connection removed successfully")
    )
});

export const getConnectionStatus = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    console.log(targetUserId,currentUserId);

    const currentUser = req.user;
    if (currentUser.connections.includes(targetUserId)) {
      return res.status(200).json(
        new ApiResponse(200, "connected","Connection accepted")
      )
    }

    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.status(200).json(
          new ApiResponse(200, "pending","Connection request pending")
        )
      } else {
        return res.status(200).json(
          new ApiResponse(200, "received","Connection request received")
        )
      }
    }

    return res.status(200).json(
      new ApiResponse(200, "not_connected","Not connected")
    )
});