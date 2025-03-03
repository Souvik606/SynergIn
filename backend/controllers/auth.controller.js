import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {ApiResponse} from "../utils/ApiResponse.js";

export const signup=asyncHandler(async (req, res) => {
    const {name, email, username, password} = req.body;

    if (!(name && email && username && password)) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{username}, {email}]
    })

    if (existedUser) {
      throw new ApiError(400, "User with email or username already exists");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name, email, password: hashedPassword, username
    })

    const createdUser=await user.save();

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{
      expiresIn: "3d"
    })

  res.cookie("jwtToken", token, {
    httpOnly: true,maxAge:3*24*60*60*1000,sameSite:"strict",
    secure:process.env.NODE_ENV === "production" });


  return res.status(200).json(
    new ApiResponse(201,createdUser,"User registered successfully"),
    )
  }
)

export const login=(req,res)=>{
  res.send("login")
}

export const logout=(req,res)=>{
  res.send("logout")
}