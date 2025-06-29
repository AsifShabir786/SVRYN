"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, TrendingUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import userStore from "@/store/userStore";
import { getAllUsers, getAllUsers1 } from "@/service/user.service";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/service/auth.service";
import useSidebarStore from "@/store/sidebarStore";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  User,
  Users,
  MoreHorizontal,
  Video,
  Store,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import toast from "react-hot-toast";
import axiosInstance from "@/service/url.service";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const { user, clearUser } = userStore();
  var userId = localStorage.getItem("userId");
  console.log(userId, "selectedUser11");
  // RightSideBar States
  const [showAllSponsers, setShowAllSponsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userList, setUserList] = useState([]);
  const [userList1, setUserList1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // LeftSideBar States
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // RightSideBar useEffect
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers();
        setUserList(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers1();
        setUserList1(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/messages/${userId}/${selectedUser._id}`
        )
        .then((res) => setMessages(res.data.data))
        .catch((err) => console.error(err));
    }
  }, [selectedUser, userId]);

  // LeftSideBar useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/users/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === "success") {
          setProfileData(response.data.data.profile.bio);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (error) {
        setError("Error fetching data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // RightSideBar Functions
  const sendMessage = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/send`, {
        senderId: userId,
        receiverId: selectedUser._id,
        text,
      })
      .then((res) => {
        setMessages((prev) => [...prev, res.data.message]);
        setText("");
      });
  };

  // LeftSideBar Functions
  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleNavigation = (path) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result?.status == "success") {
        router.push("/user-login");
        clearUser();
      }
      toast.success("user logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error("failed to log out");
    }
  };

  // Navigation items with their paths
  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/Pages", label: "Pages", icon: "📄" },
    { path: "/Groupspage", label: "Groups", icon: "👥" },
    { path: "/Chatpage", label: "Chat", icon: "💬" },
    { path: "/Ads", label: "Ads", icon: "📢" },
    { path: "/Post", label: "Posts", icon: "📝" },
    { path: "/Marketplaces", label: "Marketplace", icon: "🏬" },
    { path: "/Settings", label: "Settings", icon: "⚙️" },
    { path: "/Services", label: "Services", icon: "🛠️" },
    { path: "/Media", label: "Media", icon: "📸" },
    { path: "/Updates", label: "Updates", icon: "📢" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <aside
      className={`fixed top-16 left-0  w-80 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 ${
        isSidebarOpen
          ? "translate-x-0 bg-white dark:bg-[rgb(36,37,38)] shadow-lg"
          : "-translate-x-full"
      } md:bg-transparent md:shadow-none`}
    >
      <div
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 w-full mt-5 overflow-y-auto ${
          pathname === "/Chatpage" ? "h-[1600px]" : "max-h-[400px]"
        }`}
      >
        {" "}
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`w-full flex items-center p-2 mb-2 rounded transition-colors ${
              pathname === item.path
                ? "bg-yellow-300 text-white" // Highlight active page
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <span className="mr-2">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
      {pathname !== "/Chatpage" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 w-full mt-5">
          <h3 className="text-lg font-semibold mb-4">Online Connections</h3>
          <ul className="space-y-2 overflow-y-auto max-h-[600px]">
            {userList.map((userItem) => (
              <li
                key={userItem._id}
                className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-all ${
                  selectedUser?._id === userItem._id
                    ? "bg-yellow-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedUser(userItem);
                  setShowChatModal(true);
                }}
              >
                <Image
                  src={
                    userItem.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userItem.username
                    )}`
                  }
                  alt="cover"
                  width={20}
                  height={20}
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 break-words">
                  {userItem.username}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className="border-t border-yellow-700 pt-3 pl-3 flex justify-center items-center space-x-2 font-semibold text-sm tracking-widest w-full"
        style={{ color: "#b79f68" }}
      >
        <Image
          src="/images/icontop.png"
          alt="Transmission Icon"
          width={20}
          height={20}
        />
        <span>TRANSMISSIONS</span>
      </div>

      {showChatModal && selectedUser && (
        <div className="absolute top-[430px] left-6 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200 flex flex-col h-[40vh]">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-100 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Image
                src={
                  selectedUser.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedUser.username
                  )}`
                }
                width={20}
                height={20}
                alt={selectedUser.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-semibold text-gray-700">
                {selectedUser.username}
              </span>
            </div>
            <button
              onClick={() => setShowChatModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`px-4 py-2 rounded-lg text-sm max-w-[75%] break-words ${
                      msg.senderId === userId
                        ? "bg-blue-500 text-white"
                        : "bg-green-400 text-black"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No messages yet.</p>
            )}
          </div>
          <div className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded text-sm"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-yellow-300 text-white rounded text-sm hover:bg-yellow-400"
            >
              <Send />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default LeftSideBar;
