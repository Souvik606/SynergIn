import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {ApiResponse} from "../utils/ApiResponse.js";
import {sendWelcomeEmail} from "../email/emailHandler.js";

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

    const createdUser = await user.save();

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
      expiresIn: "3d"
    })

    res.cookie("jwtToken", token, {
      httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000, sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    res.status(201).json(
      new ApiResponse(201, createdUser, "User registered successfully"),
    )

    const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    }
    catch (emailError) {
      console.error("Error sending welcome Email", emailError);
    }
  }
)

export const login=asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  if(!(email && password)){
    throw new ApiError(400, "All fields are required");
  }

  const user=await User.findOne({email})

  if(!user) {
    throw new ApiError(400, "Email doesn't exist");
  }

  const isMatch=await bcrypt.compare(password,user.password)

  if(!isMatch) {
    throw new ApiError(400, "Invalid password");
  }

  const loggedInUser=await User.findById(user._id).select(
    "-password"
  )

  const token=jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn: "3d"});
  await res.cookie("jwtToken", token, {
    httpOnly: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  })

  return res.status(200).json(
    new ApiResponse(200, loggedInUser, "User login successful"),
  )
})

export const logout=asyncHandler(async (req, res) => {
  res.clearCookie("jwtToken");
  res.status(200).json(
    new ApiResponse(200, "","User logged out")
  );
})

export const getCurrentUser=asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200,req.user, "User details found")
  )
})