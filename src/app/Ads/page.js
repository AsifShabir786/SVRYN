"use client";
import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import useSidebarStore from "@/store/sidebarStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { X, Plus } from "lucide-react";
import Link from "next/link";
import axios from "axios";

// Simulated dynamic fetch for Short Ads
const fetchAdsData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: 1,
      title: "Good Vibes",
      file: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "John Doe",
      avatar: "https://avatars.githubusercontent.com/u/123456?v=4",
    },
    {
      id: 2,
      title: "Good Vibes",
      file: "https://images.unsplash.com/photo-1519125323398-675f398f6978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Jane Smith",
      avatar: "https://avatars.githubusercontent.com/u/789012?v=4",
    },
    {
      id: 3,
      title: "Good Vibes",
      file: "https://images.unsplash.com/photo-1501780367455-cb2f81a3c013?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Alex Brown",
      avatar: "https://avatars.githubusercontent.com/u/345678?v=4",
    },
    {
      id: 4,
      title: "Good Vibes",
      file: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Emma Wilson",
      avatar: "https://avatars.githubusercontent.com/u/901234?v=4",
    },
    {
      id: 5,
      title: "Good Vibes",
      file: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Liam Davis",
      avatar: "https://avatars.githubusercontent.com/u/567890?v=4",
    },
  ];
};

// Simulated dynamic fetch for Recent Ads
const fetchRecentAdsData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: 1,
      title: "CREATIVE CLOTHING IDEAS",
      file: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "William Faith",
      avatar: "https://avatars.githubusercontent.com/u/123456?v=4",
      likes: 550,
      comments: 81,
      hashtags: "#Ads #Cloths",
      description: "Lorem ipsum dolor sit amet, consectetur elit. Sed eiusmod eget mi vel fermentum. Donec nec convallis dolor.",
    },
    {
      id: 2,
      title: "BURGER",
      file: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "D James",
      avatar: "https://avatars.githubusercontent.com/u/789012?v=4",
      likes: 903,
      comments: 103,
      hashtags: "#Ads #Cloths",
      description: "Lorem ipsum dolor sit amet, consectetur elit. Sed eiusmod eget mi vel fermentum. Donec nec convallis dolor.",
    },
    {
      id: 3,
      title: "FURNITURE FOR YOUR HOME",
      file: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Steven B",
      avatar: "https://avatars.githubusercontent.com/u/345678?v=4",
      likes: 671,
      comments: 73,
      hashtags: "#Ads #Cloths",
      description: "Lorem ipsum dolor sit amet, consectetur elit. Sed eiusmod eget mi vel fermentum. Donec nec convallis dolor.",
    },
    {
      id: 4,
      title: "GREATNESS",
      file: "https://images.unsplash.com/photo-1501780367455-cb2f81a3c013?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Jame Mark",
      avatar: "https://avatars.githubusercontent.com/u/901234?v=4",
      likes: 3500,
      comments: 203,
      hashtags: "#Ads #Cloths",
      description: "Lorem ipsum dolor sit amet, consectetur elit. Sed eiusmod eget mi vel fermentum. Donec nec convallis dolor.",
    },
    {
      id: 5,
      title: "EXCLUSIVE FURNITURE",
      file: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Lee Beyza",
      avatar: "https://avatars.githubusercontent.com/u/567890?v=4",
      likes: 671,
      comments: 73,
      hashtags: "#Ads #Cloths",
      description: "Lorem ipsum dolor sit amet, consectetur elit. Sed eiusmod eget mi vel fermentum. Donec nec convallis dolor.",
    },
    {
      id: 6,
      title: "GREATNESS",
      file: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3",
      fileType: "image",
      username: "Gift West",
      avatar: "https://avatars.githubusercontent.com/u/123456?v=4",
      likes: 3500,
      comments: 203,
      hashtags: "#Ads #Cloths",
      description: "Lorem ipsum dolor sit amet, consectetur elit. Sed eiusmod eget mi vel fermentum. Donec nec convallis dolor.",
    },
  ];
};

// Story Preview Component
const StoryPreview = ({ file, fileType, onClose, username, avatar, onNext, onPrevious }) => {
  const userPlaceholder = username?.split(" ").map((name) => name[0]).join("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl h-[90vh] flex  bg-black rounded-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
        >
          ✖
        </button>

        {/* User Info */}
        <div className="absolute top-4 left-4 z-10 flex items-center text-white">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-2 text-sm font-semibold">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              userPlaceholder
            )}
          </div>
          <span className="font-semibold">{username}</span>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center bg-black">
          {/* Previous button */}
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white bg-opacity-20 hover:bg-opacity-40 p-2 rounded-full z-10"
            >
              ◀
            </button>
          )}

          {/* Media */}
          {fileType === "image" ? (
            <img
              src={file}
              alt="story_preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={file}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* Next button */}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white bg-opacity-20 hover:bg-opacity-40 p-2 rounded-full z-10"
            >
              ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



// Ads Component
const Ads = () => {
  const { isSidebarOpen } = useSidebarStore();
  const [ads, setAds] = useState([]);
  const [recentAds, setRecentAds] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
const [videoStories, setVideoStories] = useState([]); // only videos
const [selectedIndex, setSelectedIndex] = useState(null); // index of current story
  const [likedAds, setLikedAds] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState({});
  const [commentText, setCommentText] = useState({});
var currentUserId=localStorage.getItem("userId")
 
  const handleLikeToggle = async (adId) => {
    const isLiked = !likedAds[adId];
    setLikedAds((prev) => ({ ...prev, [adId]: isLiked }));
    await handleLikeAction(adId, isLiked);
  };

  const handleLikeAction = async (adId, isLiked) => {
    try {
      const formData = new FormData();
      formData.append("isLiked", isLiked);

      await axios.put(
        `http://localhost:9003/adsRoute/ads/${adId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const toggleCommentBox = (adId) => {
    setShowCommentBox((prev) => ({
      ...prev,
      [adId]: !prev[adId],
    }));
  };

  const handleCommentChange = (adId, text) => {
    setCommentText((prev) => ({
      ...prev,
      [adId]: text,
    }));
  };

  const submitComment = async (adId) => {
    const comment = commentText[adId]?.trim();
    if (!comment) return;

    try {
      const formData = new FormData();
      formData.append("comment", comment);
      formData.append("userId", currentUserId);

      await axios.put(
        `http://localhost:9003/adsRoute/ads/${adId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Comment submitted");
      setCommentText((prev) => ({ ...prev, [adId]: "" }));
      setShowCommentBox((prev) => ({ ...prev, [adId]: false }));
      setRefresh(!refresh)
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  }

useEffect(() => {
  const videos = ads.filter((ad) =>
    ad.mediaUrl?.match(/\.(mp4|mov|webm|ogg)$/i)
  );
  setVideoStories(videos);
}, [ads]);


  const fetchAdsData = async () => {
    try {
      const response = await fetch("http://localhost:9003/adsRoute/ads");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      return [];
    }
  };

  const fetchRecentAdsData = async () => {
    // You can modify this if recent ads come from a different endpoint or logic
    return fetchAdsData(); // Assuming it’s the same API for now
  };

  useEffect(() => {
    const loadAds = async () => {
      const shortAdsData = await fetchAdsData();
      console.log(shortAdsData,'shortAdsData_______')
      const recentAdsData = await fetchRecentAdsData();
      // setAds(shortAdsData);
      setRecentAds(recentAdsData);
    };
    loadAds();
  }, [refresh]);

 const fetchAdsData1 = async () => {
    try {
      const response = await fetch("http://localhost:9003/Adsadshort/ads");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      return [];
    }
  };

  const fetchRecentAdsData1 = async () => {
    // You can modify this if recent ads come from a different endpoint or logic
    return fetchAdsData1(); // Assuming it’s the same API for now
  };

  useEffect(() => {
    const loadAds = async () => {
      const shortAdsData = await fetchAdsData1();
      console.log(shortAdsData,'shortAdsData_______')
      const recentAdsData = await fetchRecentAdsData1();
      setAds(shortAdsData);
      // setRecentAds(recentAdsData);
    };
    loadAds();
  }, []);
const handleStoryClick = (ad) => {
  const index = videoStories.findIndex((story) => story._id === ad._id);
  if (index !== -1) setSelectedIndex(index);
};



  const handleClosePreview = () => {
    setSelectedStory(null);
  };

  const userPlaceholder = (username) => username?.split(" ").map((name) => name[0]).join("");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex flex-1 pt-16">
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
        <div
          className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto"
          style={{ width: "100%", maxWidth: "1600px" }}
        >
          <div className="lg:ml-2 xl:ml-28" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
           
            {/* Short Ads Section with Card Layout */}
      {/* Short Ads Header */}
<div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
  <span className="text-xl font-bold">Short Ads</span>
  <Link href="/Shortads">
    <Button className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6Z"
          fill="white"
        />
      </svg>
      Ad Manager
    </Button>
  </Link>
</div>

{/* Short Ads Video Cards */}
<div className="mb-6">
  <div className="flex flex-wrap gap-4 justify-start">
    {ads
      .filter((ad) => ad.mediaUrl?.match(/\.(mp4|mov|webm|ogg)$/i))
      .map((ad) => (
        <div
          key={ad._id}
          className="bg-white rounded-lg shadow-md w-48 h-64 flex flex-col justify-between overflow-hidden cursor-pointer"
          onClick={() => handleStoryClick(ad)}
        >
          <div className="h-48 w-full bg-black">
            <video
              src={ad.mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center w-full p-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white mr-2">
              {ad.createdBy?.firstName?.[0]}
            </div>
            <span className="text-gray-700 font-semibold text-sm truncate">
              {ad.campaignName}
            </span>
          </div>
        </div>
      ))}
  </div>
</div>

{/* Recent Ads Header */}
<div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
  <span className="text-xl font-bold">Recent Ads</span>
  <Link href="/CreateAds">
    <Button className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600">
      Create Ads
    </Button>
  </Link>
</div>

{/* Recent Ads Grid Layout */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {recentAds.map((ad) => (
    <div key={ad._id} className="bg-white p-4 rounded-lg shadow flex flex-col">
      {/* Media */}
      <img
        src={ad.mediaUrl}
        alt={ad.campaignName}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      {/* Top Row (User + Actions) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center overflow-hidden">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2 font-semibold text-white text-sm">
            {ad.createdBy?.firstName?.[0] || ad.createdBy?.email?.[0]}
          </div>
          <p className="font-semibold text-sm truncate">
            {ad.createdBy?.firstName || ""} {ad.createdBy?.lastName || ad.createdBy?.email}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
          <span className="cursor-pointer" onClick={() => handleLikeToggle(ad._id)}>
            {likedAds[ad._id] || ad.isLiked ? "❤️" : "🤍"}
          </span>
          <span className="cursor-pointer" onClick={() => toggleCommentBox(ad._id)}>
            💬 {ad.comments?.length || 0}
          </span>
        </div>
      </div>

      {/* Tags */}
      <p className="text-sm text-blue-600 mb-1 break-words">
        {ad.selectedTags?.map((tag) => `#${tag}`).join(" ")}
      </p>

      {/* Campaign Details */}
      <p className="text-sm mb-2 break-words">{ad.campaignDetails}</p>

      {/* Comment Box */}
      {showCommentBox[ad._id] && (
        <div className="mt-3 border-t pt-3 space-y-2">
          {ad.comments?.map((comment) => (
            <div key={comment._id} className="bg-gray-100 px-3 py-2 rounded text-sm">
              <p className="text-gray-800">{comment.comment}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText[ad._id] || ""}
            onChange={(e) => handleCommentChange(ad._id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={() => submitComment(ad._id)}
            className="px-4 py-1 text-sm bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  ))}
</div>


          </div>
        </div>
      </main>
   {selectedIndex !== null && videoStories.length > 0 && videoStories[selectedIndex] && (
  <StoryPreview
    file={videoStories[selectedIndex].mediaUrl}
    fileType="video"
    onClose={() => setSelectedIndex(null)}
    username={videoStories[selectedIndex].createdBy?.email || "Unknown"}
    avatar={videoStories[selectedIndex].createdBy?.avatar || ""}
    onNext={() =>
      setSelectedIndex((prev) =>
        prev < videoStories.length - 1 ? prev + 1 : prev
      )
    }
    onPrevious={() =>
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    }
  />
)}

    </div>
  );
};

export default Ads;