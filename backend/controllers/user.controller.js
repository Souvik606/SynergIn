import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../lib/cloudinary.js";

export const getSuggestedConnections=asyncHandler(async (req, res) => {
  const connections=await User.findById(req?.user._id).select("connections")

  const suggestedUsers=await User.find({
      _id: {
        $ne: req.user._id,
        $nin: connections
      }
    }).select("name username profilePicture headline")
    .limit(3);

  return res.status(200).json(
    new ApiResponse(200, suggestedUsers,"Suggested users list")
  );
})

export const getProfile=asyncHandler(async (req, res) => {
  const user=await User.findOne({
    username:req.params.username}).select("-password")

  if(!user){
    throw new ApiResponse(404, "User not found")
  }

  return res.status(200).json(
    new ApiResponse(200, user,"Profile details found")
  );
})

export const updateProfile=asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "username",
    "headline",
    "about",
    "location",
    "skills",
    "experience",
    "education",
  ];

  const updatedData={}

  for(const field of allowedFields){
    if(req.body[field]){
      updatedData[field] = req.body[field];
    }
  }

  console.log(req.files)
  const profilePictureLocalPath=req.files?.profilePicture[0]?.path;

  if(profilePictureLocalPath){
    const profilePicture=await uploadOnCloudinary(profilePictureLocalPath);
    updatedData["profilePicture"]=profilePicture.secure_url;
  }

  const bannerImgLocalPath=req.files?.bannerImg[0]?.path;

  if(bannerImgLocalPath){
    const bannerImg=await uploadOnCloudinary(bannerImgLocalPath);
    updatedData["bannerImg"]=bannerImg.secure_url;
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
    "-password"
  );

  if(!user){
    throw new ApiResponse(500, "Can't update user")
  }

  return res.status(200).json(
    new ApiResponse(200, user,"Profile details updated")
  );
})