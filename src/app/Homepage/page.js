"use client";
import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import StorySection from "@/app/story/StorySection";
import NewPostForm from "../posts/NewPostForm";
import PostCard from "../posts/PostCard";
import { Camera, Edit, MapPin, Briefcase, GraduationCap, Heart, Home, Phone } from "lucide-react"
import { usePostStore } from "@/store/usePostStore";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import useSidebarStore from "@/store/sidebarStore";
 import { useParams } from "next/navigation";
 import Link from 'next/link';

import { fetchUserProfile } from "@/service/user.service";
import ProfileHeader from "../user-profile/ProfileHeader";
import ProfileTabs from "../user-profile/ProfileTabs";
import axiosInstance from "@/service/url.service";
const HomePage = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const [likePosts, setLikePosts] = useState(new Set());
  const { posts, fetchPost, handleLikePost, handleCommentPost, handleSharePost } = usePostStore();
  const { isSidebarOpen } = useSidebarStore(); // Use sidebar store
const user = JSON.parse(localStorage.getItem("user-storage") || '{}');
 console.log(user?.state?.user?._id, 'user_____1');
    const id = user?.state?.user?._id
      const [posts1, setposts1] = useState([]);
const [post, setPost] = useState(null); // only 1 item, not an array

useEffect(() => {
  const fetchListings = async () => {
    try {
      const response = await fetch("https://fb-backend.vercel.app/MarketPlace/marketplace");
      const data = await response.json();
      console.log("Fetched posts:___12", data.data);

      if (data.status === "success" && data.data.length > 0) {
        setPost(data.data[0]); // only first index
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setMessage("❌ Failed to fetch listings");
    }
  };

  fetchListings();
}, [refresh]);

      console.log('Fetched posts:___________MediaID:', posts); 
        useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axiosInstance.get(`/postRoute/posts/user/${id}?media=${'video'}`);
            console.log("Fetched posts:___11", response.data.data);
            setposts1(response.data.data)
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
    
        fetchPosts();
      }, [refresh]);
    
   const [profileData, setProfileData] = useState(null);
   console.log(profileData,'profileData_____-')
   const [loading, setLoading] = useState(false);
   const [isOwner, setIsOwner] = useState(false);
 
   const fetchProfile = async () => {
     setLoading(true);
     try {
       const result = await fetchUserProfile(id);
       setProfileData(result.profile);
       setIsOwner(result.isOwner);
     } catch (error) {
       console.error(error);
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     if (id) {
       fetchProfile();
     }
   }, [id]);
   useEffect(() => {
    fetchPost();
  }, [fetchPost]);
  
  useEffect(() => {
    const saveLikes = localStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

   if (!profileData) {
     return <div>Loading...</div>;
   }


  const handleLike = async (postId) => {
    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
      toast.error("post disliked successfully");
    } else {
      updatedLikePost.add(postId);
      toast.success("post liked successfully");
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem("likePosts", JSON.stringify(Array.from(updatedLikePost)));

    try {
      await handleLikePost(postId);
      await fetchPost();
    } catch (error) {
      console.error(error);
      toast.error("failed to like or unlike the post");
    }
  };

  return (
    <>
    
    {/* <ProfileHeader
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      /> */}
   
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        {/* Show LeftSideBar on mobile only if isSidebarOpen is true, always show on md and above */}
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
        <div className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto" style={{ width: "100%", maxWidth: "1600px" }}>
          <div className="lg:ml-2 xl:ml-28" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
        <div className="flex flex-col    mx-auto bg-white shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="w-full h-48">
        <img src={profileData.coverPhoto || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
      </div>

      {/* Profile Info Section - Flex container for profile picture and info */}
      <div className="flex items-start px-4 py-3">
        {/* Profile Picture - Increased size and positioned at the top */}
        <div className="relative -mt-12 mr-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
            <img
              src={profileData.profilePicture || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info - positioned next to profile picture */}
        <div className="flex-1 pt-2">
          {/* Name */}
          <h1 className="text-2xl font-serif italic font-semibold text-gray-900">
            {profileData.firstName} {profileData.lastName}
          </h1>

          {/* Bio */}
          <p className="mt-1 text-sm text-gray-600">
            {profileData.bio.workplace} based in {profileData.bio.liveIn},
            <br />
            inspired by {profileData.desc}
          </p>

          {/* Website Link */}
          <div className="mt-1 flex items-center text-sm text-blue-500">
            <span className="mr-1">Link:</span>
            <a href="#" className="hover:underline flex items-center">
              www.{profileData.username.toLowerCase()}.com
            </a>
          </div>
        </div>
      </div>

      {/* Follower Stats - Moved outside the profile info container */}
      <div className="w-full bg-gray-50 py-2 px-4 border-t border-b border-gray-200">
        <div className="flex items-center space-x-4 ml-28 text-sm">
          <div className="font-medium">{profileData.followerCount} Follows</div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="font-medium">{profileData.followingCount} Following</div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-3 gap-2 p-4">
        {/* Card 1 */}
          <Link
       href={`/Marketplaces?id=${id}`}
      className="flex flex-col cursor-pointer"
    >
        <div className="flex flex-col">
          <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxYUIMs1xNBhE7fKNtPXTIogB3cW9zAyLcQ&s" alt="RSVP Shop" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs mt-1 text-center">
            Visit {profileData.firstName}'s
            <br />
            RSVP Shop
          </p>
        </div>
</Link>
        {/* Card 2 */}
       <div className="flex flex-col">
  <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
    <img
      src={post?.imageUrl?.[0] || "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg?height=200&width=200"}
      alt="Shoes"
      className="w-full h-full object-cover"
    />
  </div>
  <p className="text-xs mt-1 text-center">
    View {profileData?.firstName}'s
    <br />
    Shoes
  </p>
</div>

{posts1
  // .filter((post) => post.mediaType === 'video')
  .map((post) => (
    <Link
      key={post._id}
      href={`/Media?media=video&id=${id}`}
      className="flex flex-col cursor-pointer"
    >
      <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
      <video
  src={post.mediaUrl}
  muted
  loop
  playsInline
  className="w-full h-full object-cover"
/>

      </div>
      <p className="text-xs mt-1 text-center">
        View {profileData.firstName}'s
        <br />
        Videos
      </p>
    </Link>
))}


        {/* Card 3 */}
        {/* <div className="flex flex-col">
          <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
            <img src="https://i.ytimg.com/vi/UH1ThWZ9hXU/hqdefault.jpg?height=200&width=200" alt="Videos" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs mt-1 text-center">
            View {profileData.firstName}'s
            <br />
            Videos
          </p>
        </div> */}
      </div>
    </div>
            <StorySection />

            <NewPostForm
              isPostFormOpen={isPostFormOpen}
              setIsPostFormOpen={setIsPostFormOpen}
            />
            <div className="mt-6 space-y-6 mb-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  isLiked={likePosts.has(post?._id)}
                  onLike={() => handleLike(post?._id)}
                  onComment={async (comment) => {
                    await handleCommentPost(post?._id, comment.text);
                    await fetchPost();
                  }}
                  onShare={async () => {
                    await handleSharePost(post?._id);
                    await fetchPost();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default HomePage;