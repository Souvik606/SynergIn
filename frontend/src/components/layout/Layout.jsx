import Navbar from "./Navbar.jsx";
import {useQuery} from "@tanstack/react-query";

const Layout=({children})=>{
  const {data:authUser,isLoading}=useQuery({queryKey:["authUser"]})

  return <div className="min-h-screen bg-base-100">
    <Navbar/>
    <main className="max-w-[1350px] mx-auto px-6 py-5">
      {children}
    </main>
  </div>
}

export default Layout;