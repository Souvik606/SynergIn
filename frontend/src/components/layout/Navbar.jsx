import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../lib/axios.js";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const {data:authUser}=useQuery({queryKey:["authUser"]});
  console.log("authUser", authUser)
  const queryClient = useQueryClient();

  const {data:notifications} = useQuery({queryKey:["notifications"],
      queryFn:async ()=>axiosInstance.get("/notifications"),
      enabled:!!authUser
    })

  const {data:connectionRequests} = useQuery({queryKey:["connectionRequests"],
    queryFn:async ()=>axiosInstance.get("/connections/requests"),
    enabled:!!authUser
  })

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError:(error)=>{
      toast.error(error.response?.data.split("Error:").pop().split("<br>")[0]||"Something went wrong")
    }
  });

  const unreadNotificationCount = notifications?.data.data.filter((notif) => !notif.read).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.data.length;

  return (
    <nav className='bg-secondary shadow-md sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          <div className='flex items-center space-x-4'>
            <Link to='/'>
              <img className='h-10 rounded' src='/logo.svg' alt='LinkedIn' />
            </Link>
          </div>
          <div className='flex items-center gap-2 md:gap-6'>
            {authUser ? (
              <>
                <Link to={"/"} className='hover:scale-105 hover:transform text-neutral flex flex-col items-center'>
                  <Home size={28} />
                  <span className='text-base hidden md:block'>Home</span>
                </Link>
                <Link to='/network' className='hover:scale-105 hover:transform text-neutral flex flex-col items-center relative'>
                  <Users size={28} />
                  <span className='text-base hidden md:block'>My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className='absolute -top-1 -right-1 md:right-7 bg-blue-500 text-white text-
										rounded-full size-3 md:size-4 flex items-center justify-center'
                    >
											{unreadConnectionRequestsCount}
										</span>
                  )}
                </Link>
                <Link to='/notifications' className='hover:scale-105 hover:transform text-neutral flex flex-col items-center relative'>
                  <Bell size={28} />
                  <span className='text-base hidden md:block'>Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className='absolute -top-1 -right-1 md:right-7 bg-blue-500 text-white text-xs
										rounded-full size-3 md:size-4 flex items-center justify-center'
                    >
											{unreadNotificationCount}
										</span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.data.username}`}
                  className='hover:scale-105 hover:transform text-neutral flex flex-col items-center'
                >
                  <User size={28} />
                  <span className='text-base hidden md:block'>Me</span>
                </Link>
                <button
                  className='pl-16 hover:scale-105 hover:transform flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
                  onClick={() => logout()}
                >
                  <LogOut size={28} />
                  <span className='hidden md:inline text-lg'>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='text-xl font-semibold btn btn-ghost'>
                  Sign In
                </Link>
                <Link to='/signup' className='text-xl font-semibold btn btn-primary'>
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;