import { useState } from 'react'
import Layout from "./components/layout/Layout.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import toast, {Toaster} from "react-hot-toast";
import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "./lib/axios.js";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";

function App() {
  const {data:authUser,isLoading}=useQuery({
      queryKey: ['authUser'],
      queryFn:async()=>{
        try{
          const res=await axiosInstance.get("/auth/user");
          return res.data;
        }
        catch(error){
          if(error.response && error.response.status === 401){
            return null
          }
          toast.error(error.response.data.message||"Something went wrong");
        }
      }
    }
  );

  if(isLoading){
    return null
  }

  return <Layout>
    <Routes>
      <Route path="/" element={authUser?<HomePage/>:<Navigate to={"/login"}/>}/>
      <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to={"/"}/>}/>
      <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
      <Route path="/notifications" element={authUser?<NotificationsPage/>:<Navigate to={"/login"}/>}/>
      <Route path="/network" element={authUser?<NetworkPage/>:<Navigate to={"/login"}/>}/>
    </Routes>
    <Toaster/>
  </Layout>
}

export default App
