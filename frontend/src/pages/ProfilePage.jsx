import {useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../lib/axios.js";
import ProfileHeader from "../components/ProfileHeader.jsx";
import toast from "react-hot-toast";
import AboutSection from "../components/AboutSection.jsx";
import ExperienceSection from "../components/ExperienceSection.jsx";
import EducationSection from "../components/EducationSection.jsx";
import SkillsSection from "../components/SkillsSection.jsx";

const ProfilePage = () => {
  const {username}=useParams();
  const queryClient=useQueryClient();

  const {data:authUser,isLoading}=useQuery({queryKey:["authUser"]})

  const {data:userProfile,isLoading:isUserProfileLoading}=useQuery({
    queryKey:["userProfile",username],
    queryFn:() => axiosInstance.get(`/users/${username}`),
  })

  const {mutate:updateProfile}=useMutation({
    mutationFn:async(updatedData)=>{
      console.log("updatedData",updatedData);
      await axiosInstance.patch("/users/update-profile",updatedData,{
        headers: {"Content-Type": "multipart/form-data"},
      })
    },
    onSuccess:()=>{
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile",username])
    },
    onError:()=>{
      toast.error("An error occurred");
    }
  })

  if(isLoading||isUserProfileLoading) return null

  const isOwnProfile=authUser.data.username === userProfile.data.data.username;
  const userData=isOwnProfile?authUser.data:userProfile.data.data;

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
    </div>
  );

}

export default ProfilePage;