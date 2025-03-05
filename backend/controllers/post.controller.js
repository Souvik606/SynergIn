import {asyncHandler} from "../utils/asyncHandler.js";
import Post from "../models/post.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {deleteFromCloudinary, uploadOnCloudinary} from "../lib/cloudinary.js";
import {ApiError} from "../utils/ApiError.js";
import Notification from "../models/notifications.model.js";

export const getFeedPosts=asyncHandler(async (req, res) => {
  const posts=await Post.find({
    author:{
      $in:req.user.connections
    }
  }).populate("author","name username profilePicture headline")
    .populate("comments.user","name profilePicture")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, posts,"Posts fetched successfully")
  );
})

export const createPosts=asyncHandler(async (req, res) => {
  const {content}=req.body;
  let newPost;

  const postImageLocalPath=req.files?.image[0]?.path;

  if(!postImageLocalPath){
    newPost=new Post({
      author:req.user._id,
      content:content,
    })
  }
  else{
    const postImage=await uploadOnCloudinary(postImageLocalPath);
    newPost=new Post({
      author:req.user._id,
      content:content,
      image:postImage.secure_url,
    })
  }

  const post=await newPost.save();

  if(!post){
    throw new ApiError(500,"Post can't be created.Interna Server error");
  }

  return res.status(200).json(
    new ApiResponse(200, post,"Post created successfully")
  );
})

export const deletePost=asyncHandler(async (req, res) => {
  const postId=req.params.id;
  const userId=req.user._id;

  const post=await Post.findById(postId);

  if(!post){
    throw new ApiError(404,"Post not found");
  }

  if(post.author.toString()!==req.user._id.toString()){
    throw new ApiError(403,"Unauthorized access");
  }

  if(post.image){
    await deleteFromCloudinary(post.image);
  }

  const deletedPost=await Post.findByIdAndDelete(postId);

  return res.status(200).json(
    new ApiResponse(200, deletedPost,"Post deleted successfully")
  )
})

export const getPostById=asyncHandler(async (req, res) => {
  const postId=req.params.id;
  const post=await Post.findById(postId)
    .populate("author","name username profilePicture headline")
    .populate("comments.user","name profilePicture username headline")

  if(!post){
    throw new ApiError(404,"Post not found");
  }

  return res.status(200).json(
    new ApiResponse(200, post,"Post fetched successfully")
  )
})

export const createComment=asyncHandler(async (req, res) => {
  const postId=req.params.id;
  const {content}=req.body;

  const post=await Post.findByIdAndUpdate(postId,{
    $push:{comments:{user:req.user._id,content:content}}},{new:true}
  )

  if(!post){
    throw new ApiError(404,"Post not found");
  }

  if(post.author.toString()!==req.user._id.toString()){
    const newNotification=new Notification({
      recipient:post.author,
      type:"comment",
      relatedUser:req.user._id,
      relatedPost:postId,
    })

    await newNotification.save();
  }

  return res.status(200).json(
    new ApiResponse(200, post,"Comment created successfully")
  )
  }
)

export const likePost=asyncHandler(async (req, res) => {
  const postId=req.params.id;
  const post=await Post.findById(postId);

  if(!post){
    throw new ApiError(404,"Post not found");
  }

  if(post.likes.includes(req.user._id)){
    post.likes=post.likes.filter((id)=>id.toString()!==req.user._id.toString());
  }
  else{
    post.likes.push(req.user._id)

    if(post.author.toString()!==req.user._id.toString()){
      const newNotification=new Notification({
        recipient:post.author,
        type:"like",
        relatedUser:req.user._id,
        relatedPost:postId,
      })

      await newNotification.save();
    }
  }

  await post.save()

  return res.status(200).json(
    new ApiResponse(200, post,"Liked successfully")
  )
})