import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostCreation = ({user}) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const queryClient=useQueryClient();

  const {mutate:createPostMutation,isPending}= useMutation({
    mutationFn:async(postData)=>{
      const res=await axiosInstance.post("/posts/create",postData,{
        headers: {"Content-Type": "multipart/form-data"},
      });
      return res.data;
    },
    onSuccess:()=>{
      resetForm();
      toast.success('Post created successfully.');
      queryClient.invalidateQueries({queryKey:["posts"]});
    },
    onError:(error)=>{
      toast.error(error.response?.data.split("Error:").pop().split("<br>")[0]||"Something went wrong");;
    }
  });

  const handlePostCreation = async () => {
    try{
      console.log("content",content);
      const postData=new FormData();
      postData.append("content", content);
      if(image){
        postData.append("image", image);
      }

      createPostMutation(postData)
    }
    catch(error){
      console.error("Error in handlePostCreation",error)
    }
  }

  const resetForm = () => {
    setContent('');
    setImage('');
    setImagePreview('');
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className='bg-secondary rounded-lg shadow mb-4 p-4'>
      <div className='flex space-x-3'>
        <img src={user.profilePicture || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
        <textarea
          placeholder="What's on your mind?"
          className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className='mt-4 flex justify-center'>
          <img src={imagePreview} alt='Selected' className='w-[75px] h-auto rounded-lg' />
        </div>
      )}

      <div className='flex justify-between items-center mt-4'>
        <div className='flex space-x-4'>
          <label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
            <Image size={20} className='mr-2' />
            <span>Photo</span>
            <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
          </label>
        </div>

        <button
          className='btn btn-primary text-lg font-semibold rounded-full text-white px-8 py-2'
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
        </button>
      </div>
    </div>
  );
}

export default PostCreation;