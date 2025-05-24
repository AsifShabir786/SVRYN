"use client";
import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import useSidebarStore from "@/store/sidebarStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { X, Plus } from "lucide-react";
import Link from "next/link";

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
const StoryPreview = ({ file, fileType, onClose, username, avatar }) => {
  const userPlaceholder = username?.split(" ").map((name) => name[0]).join("");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md h-[70vh] flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <Button
          className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          variant="ghost"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="absolute top-4 left-4 z-10 flex items-center">
          <Avatar className="w-10 h-10 mr-2">
            {avatar ? (
              <AvatarImage src={avatar} alt={username} />
            ) : (
              <AvatarFallback>{userPlaceholder}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-gray-700 dark:text-gray-200 font-semibold">
            {username}
          </span>
        </div>
        <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          {fileType === "image" ? (
            <img
              src={file}
              alt="story_preview"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={file}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain"
            />
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

  useEffect(() => {
    const loadAds = async () => {
      const shortAdsData = await fetchAdsData();
      const recentAdsData = await fetchRecentAdsData();
      setAds(shortAdsData);
      setRecentAds(recentAdsData);
    };
    loadAds();
  }, []);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
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
            <div className="mb-4 flex justify-between items-center">
              <span className="text-xl" style={{ fontWeight: "bold", fontSize: "20px" }}>
                Short Ads
              </span>
              <Link href="/AdManager">
                <Button className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6Z"
                      fill="white"
                    />
                  </svg>
                  Ad Manager
                </Button>
              </Link>
            </div>
            {/* Short Ads Section with Card Layout */}
            <div className="mb-6">
              <div className="flex space-x-4 overflow-x-auto">
                {ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-white rounded-lg shadow-md p-2 w-48 h-64 flex flex-col items-center justify-between cursor-pointer"
                    onClick={() => handleStoryClick(ad)}
                  >
                    <img
                      src={ad.file}
                      alt={ad.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="flex items-center w-full p-2">
                      <Avatar className="w-8 h-8 mr-2">
                        {ad.avatar ? (
                          <AvatarImage src={ad.avatar} alt={ad.username} />
                        ) : (
                          <AvatarFallback>{userPlaceholder(ad.username)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-gray-700 font-semibold text-sm">{ad.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <span className="text-xl" style={{ fontWeight: "bold", fontSize: "20px" }}>
                Recent Ads
              </span>
              <Link href="/CreateAds">  
                <Button className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600">
                  Create Ads
                </Button>
              </Link>
            </div>
            {/* Recent Ads Section with Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentAds.map((ad) => (
                <div key={ad.id} className="bg-white p-4 rounded-lg shadow">
                  <img
                    src={ad.file}
                    alt={ad.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Avatar className="w-8 h-8 mr-2">
                        {ad.avatar ? (
                          <AvatarImage src={ad.avatar} alt={ad.username} />
                        ) : (
                          <AvatarFallback>{userPlaceholder(ad.username)}</AvatarFallback>
                        )}
                      </Avatar>
                      <p className="font-semibold">{ad.username}</p>
                    </div>
                    <div className="flex space-x-2 text-sm text-gray-600">
                      <span>❤️ {ad.likes.toLocaleString()}</span>
                      <span>💬 {ad.comments}</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 mb-1">{ad.hashtags}</p>
                  <p className="text-sm">{ad.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {selectedStory && (
        <StoryPreview
          file={selectedStory.file}
          fileType={selectedStory.fileType}
          onClose={handleClosePreview}
          username={selectedStory.username}
          avatar={selectedStory.avatar}
        />
      )}
    </div>
  );
};

export default Ads;