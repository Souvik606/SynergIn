import {axiosInstance} from "../lib/axios.js";
import {useQuery} from "@tanstack/react-query";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation.jsx";
import {Users} from "lucide-react"
import Post from "../components/Post.jsx";
import RecommendedUser from "../components/RecommenedUser.jsx";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {data: recommendedUsers,isSuccess} = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('users/suggestions');
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  })

  isSuccess && console.log("recommendedUsers",recommendedUsers.data)

  const {data: posts} = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/posts');
      return res.data;
    }
  })

  return <div className='grid grid-cols-1 lg:grid-cols-4 gap-10'>
    <div className='hidden lg:block lg:col-span-1'>
      <Sidebar user={authUser.data}/>
    </div>
    <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
      <PostCreation user={authUser.data}/>
      {posts?.data.map((post) => (
        <Post key={post._id} post={post}/>
      ))}
      {posts?.data.length === 0 && (
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <div className='mb-6'>
            <Users size={64} className='mx-auto text-blue-500'/>
          </div>
          <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
          <p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
        </div>
      )}
    </div>
    <div className='col-span-1 lg:col-span-1 hidden lg:block'>
      {isSuccess && recommendedUsers?.data.length > 0 && (
        <div className='bg-secondary rounded-lg shadow p-4'>
          <h2 className='font-semibold text-xl mb-6'>People you may know</h2>
          {recommendedUsers?.data.map((user) => (
            <RecommendedUser key={user._id} user={user}/>
          ))}
        </div>
      )}
      {recommendedUsers?.data.length === 0 && (
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <div className='mb-6'>
            <Users size={64} className='mx-auto text-blue-500'/>
          </div>
          <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Suggestions Yet</h2>
          <p className='text-gray-600 mb-6'>We will show suggested users as soon as our network expands</p>
        </div>
      )}
    </div>
  </div>
}

export default HomePage;