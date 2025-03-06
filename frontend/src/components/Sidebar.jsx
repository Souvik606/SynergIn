import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
  console.log(user);
  return (
    <div className='bg-secondary rounded-lg shadow'>
      <div className='p-4 text-center'>
        <div
          className='h-16 rounded-t-lg bg-cover bg-center'
          style={{
            backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
          }}
        />
        <Link to={`/profile/${user.username}`}>
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className='w-20 h-20 rounded-full mx-auto mt-[-40px]'
          />
          <h2 className='text-xl font-semibold mt-2'>{user.name}</h2>
        </Link>
        <p className='text-info font-semibold'>{user.headline}</p>
        <p className='text-info text-base font-semibold'>{user.connections?.length} connections</p>
      </div>
      <div className='border-t border-base-100 p-4'>
        <nav>
          <ul className='space-y-2'>
            <li>
              <Link
                to='/'
                className='flex text-lg items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
              >
                <Home className='mr-2' size={24} /> Home
              </Link>
            </li>
            <li>
              <Link
                to='/network'
                className='text-lg flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
              >
                <UserPlus className='mr-2' size={24} /> My Network
              </Link>
            </li>
            <li>
              <Link
                to='/notifications'
                className='text-lg flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
              >
                <Bell className='mr-2' size={24} /> Notifications
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className='border-t border-base-100 hover:scale-105 hover:transform p-4'>
        <Link to={`/profile/${user.username}`} className='flex justify-center text-lg font-semibold'>
          Visit your profile
        </Link>
      </div>
    </div>
  );
}