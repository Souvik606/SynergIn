import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const PostPage = () => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => axiosInstance.get(`/posts/${postId}`),
  });

  console.log("post",post);

  if (isLoading) return <div>Loading post...</div>;
  if (!post?.data.data) return <div>Post not found</div>;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={authUser.data} />
      </div>

      <div className='col-span-1 lg:col-span-3'>
        <Post post={post.data.data} />
      </div>
    </div>
  );
};
export default PostPage;