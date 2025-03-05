import {asyncHandler} from "../utils/asyncHandler.js";
import Notification from "../models/notifications.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({recipient: req.user._id})
    .sort({ createdAt: -1 })
    .populate("relatedUser","name username profilePicture")
    .populate("relatedPost","content image");

  return res.status(200).json(
    new ApiResponse(200, notifications,"Notifications successfully retrieved"),
  );
})

export const markNotificationRead=asyncHandler(async (req, res) => {
  const notificationId=req.params.id

  const notification=await Notification.findByIdAndUpdate(
    {_id:notificationId,recipient:req.user._id},
    {read:true},
    {new:true}
    )

  if(!notification){
    throw new ApiError(404,"Notification not found");
  }

  return res.status(200).json(
    new ApiResponse(200, notification,"Marked read successfully"),
  )
})

export const deleteNotification=asyncHandler(async (req, res) => {

  const deletedNotification=await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  })

  if(!deletedNotification){
    throw new ApiError(404,"Notification not found");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedNotification,"Notification deleted successfully"),
  )
})