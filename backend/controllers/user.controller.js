import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../lib/cloudinary.js";

export const getSuggestedConnections = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user._id).select("connections");
  const connections = user?.connections || [];

  let suggestedUsers = await User.find({
    _id: {
      $ne: req.user._id,
      $nin: connections
    }
  })
    .select("name username profilePicture headline");

  // Randomize the suggested users list
  suggestedUsers = suggestedUsers.sort(() => Math.random() - 0.5).slice(0, 4);

  return res.status(200).json(
    new ApiResponse(200, suggestedUsers, "Suggested users list")
  );
});

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
  console.log(req.body)
  const allowedFields = [
    "name",
    "username",
    "headline",
    "about",
    "location",
    "skills",
    "experiences",
    "education",
  ];

  const updatedData={}

  for(const field of allowedFields){
    if(req.body[field]){
      updatedData[field] = req.body[field];
    }
  }

  if(req.files && req.files.profilePicture){
    const profilePictureLocalPath=req.files?.profilePicture[0]?.path;

    if(profilePictureLocalPath){
      const profilePicture=await uploadOnCloudinary(profilePictureLocalPath);
      updatedData["profilePicture"]=profilePicture.secure_url;
    }
  }

  if(req.files && req.files.bannerImg){
    const bannerImgLocalPath=req.files?.bannerImg[0]?.path;

    if(bannerImgLocalPath){
      const bannerImg=await uploadOnCloudinary(bannerImgLocalPath);
      updatedData["bannerImg"]=bannerImg.secure_url;
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
    "-password"
  );

  console.log("user",user)

  if(!user){
    throw new ApiResponse(500, "Can't update user")
  }

  return res.status(200).json(
    new ApiResponse(200, user,"Profile details updated")
  );
})