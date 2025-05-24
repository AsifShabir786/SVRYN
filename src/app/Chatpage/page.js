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
import LeftSideBar from "../components/LeftSideBar";

const Chatpage = () => {
  const { isSidebarOpen } = useSidebarStore(); // Use sidebar store
const [userList, setUserList] = useState([]);
  const [userList1, setUserList1] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user, clearUser } = userStore();
  const [loading, setLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



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
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/messages/${user._id}/${selectedUser._id}`)
        .then((res) => setMessages(res.data.data))
        .catch((err) => console.error(err));
    }
  }, [selectedUser, user._id]);

  // LeftSideBar useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/users/profile/6686f5dc61546b507649caf2`, {
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
        senderId: user._id,
        receiverId: selectedUser._id,
        text,
      })
      .then((res) => {
        setMessages((prev) => [...prev, res.data.message]);
        setText("");
      });
  };


  return (
    
    <div className="flex flex-col min-h-screen bg-background text-foreground ">
      <main className="flex flex-1 pt-16">
        {/* Show LeftSideBar on mobile only if isSidebarOpen is true, always show on md and above */}
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
  
    <div className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto " style={{ width: "100%", maxWidth: "1600px" }}>
  <div className="lg:ml-2 xl:ml-28 flex border-4 p-4 border-[#d3c19a] rounded-xl shadow" style={{ width: "100%", marginTop: "20px" }}>
    {/* Left Section: Online Connections */}
    <div style={{ width: "50%", marginRight: "1rem" }}>
      <h3 className="text-lg font-semibold mb-4">Online Connections</h3>
      <ul className="space-y-2 overflow-y-auto max-h-[680px]">
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
            <img
              src={
                userItem.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.username)}`
              }
              alt={userItem.username}
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700 break-words">
              {userItem.username}
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Right Section: Chat Modal */}
    <div style={{ width: "50%" }}>
      {showChatModal && selectedUser && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[680px]"style={{marginTop:"45px"}}>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-100 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <img
                src={
                  selectedUser.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.username)}`
                }
                alt={selectedUser.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-semibold text-gray-700">{selectedUser.username}</span>
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
                    msg.senderId === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`px-4 py-2 rounded-lg text-sm max-w-[75%] break-words ${
                      msg.senderId === user._id
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
    </div>
  </div>
</div>
      </main>
    </div>
  );
};

export default Chatpage;