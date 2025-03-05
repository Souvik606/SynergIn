import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

export const protectRoute=asyncHandler(async (req, res,next) => {
  const token=req.cookies["jwtToken"];

  if(!token){
    throw new ApiError(401,"Unauthorized access-No token provided");
  }

  const decoded=jwt.verify(token,process.env.JWT_SECRET);

  if(!decoded){
    throw new ApiError(401,"Unauthorized access-Invalid token provided");
  }

  const user=await User.findById(decoded.userId).select("-password");

  if(!user){
    throw new ApiError(404,"User not found");
  }
  req.user=user;
  next();
})
