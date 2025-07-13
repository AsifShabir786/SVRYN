"use client";
import React, { useEffect, useState } from "react";
import RightSideBar from "../components/RightSideBar";
import StorySection from "@/app/story/StorySection";
import NewPostForm from "../posts/NewPostForm";
import PostCard from "../posts/PostCard";
import { usePostStore } from "@/store/usePostStore";
import toast from "react-hot-toast";
import { Send, Trash2 } from "lucide-react";
import useSidebarStore from "@/store/sidebarStore";
import LeftSideBar from "../components/LeftSideBar";
import axios from "axios";
import Image from "next/image";

const Groupspage = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const {
    posts,
    fetchPost,
    handleLikePost,
    handleCommentPost,
    handleSharePost,
  } = usePostStore();
  const [groups, setGroups] = useState([]);
  const { isSidebarOpen } = useSidebarStore();
  const [activeTab, setActiveTab] = useState("Your feed");
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user-storage"));
  // const staticUserId = currentUser?.state?.user?._id;
  var staticUserId = localStorage.getItem("userId");

  // State for the Create Group modal
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [message, setMessage] = useState("");

  // State for the View Group modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    const saveLikes = localStorage.getItem("likePosts");
    if (saveLikes) {
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9003/groupRoute/groups?userId=${staticUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  useEffect(() => {
    fetchGroups();
  }, []);
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
    localStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    try {
      await handleLikePost(postId);
      await fetchPost();
    } catch (error) {
      console.error(error);
      toast.error("failed to like or unlike the post");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.post(
        `http://localhost:9003/groupRoute/group/join/${groupId}`,
        { userId: staticUserId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ Joined group successfully!`);
      fetchGroups();
    } catch (error) {
      console.error("Error joining group:", error);
      setMessage(
        `❌ Could not join group: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || !description) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:9003/groupRoute/group?userId=${staticUserId}`,
        {
          name: groupName,
          userId: staticUserId,
          description,
          privacy,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Group created successfully!");
      setShowModal(false);
      setGroupName("");
      setDescription("");
      setPrivacy("Public");
      fetchGroups();
    } catch (err) {
      console.error(err);
      setMessage(
        `❌ Failed to create group: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
    setShowViewModal(true);
  };

  const Tab = ({ label, isActive, onClick, icon }) => (
    <button
      className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
      onClick={onClick}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </button>
  );

  const filteredPosts = () => {
    if (!posts || !Array.isArray(posts)) return [];

    if (activeTab === "Your feed") {
      return posts;
    } else if (activeTab === "Discover") {
      return [];
    } else if (activeTab === "Your groups") {
      return posts.filter(
        (post) =>
          post?.pages === "groups" &&
          groups.some((group) => group._id === post?.groupId)
      );
    }
    return posts;
  };

  const userGroups = groups.filter((group) =>
    group.members.includes(staticUserId)
  );

  const GroupCard = ({ group, isDiscoverTab = false }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={group.admin.profilePicture || "/default-group.png"}
          alt={group.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{group.name}</h3>
          <p className="text-gray-600">
            {group.description || "No description available"}
          </p>
          <p className="text-sm text-gray-500">
            {group.memberCount || 0} members
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className={`py-1 px-3 rounded-lg text-sm ${
            isDiscoverTab && userGroups.some((g) => g._id === group._id)
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={
            isDiscoverTab
              ? () => handleJoinGroup(group._id)
              : () => handleViewGroup(group)
          }
          disabled={
            isDiscoverTab && userGroups.some((g) => g._id === group._id)
          }
        >
          {isDiscoverTab
            ? userGroups.some((g) => g._id === group._id)
              ? "Joined"
              : "Join Group"
            : "View group"}
        </button>
        {!isDiscoverTab && (
          <button
            className="text-gray-500 hover:text-red-500"
            title="Leave group"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex flex-1 pt-16">
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
        <div
          className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto"
          style={{ width: "100%", maxWidth: "1600px" }}
        >
          <div
            className="lg:ml-2 xl:ml-28"
            style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
          >
            <div className="flex space-x-2 bg-gray-200 rounded-lg p-1 shadow-md mb-4">
              {[
                { label: "Your feed", icon: "📡" },
                { label: "Discover", icon: "🔍" },
                { label: "Your groups", icon: "👥" },
              ].map((tab) => (
                <Tab
                  key={tab.label}
                  label={tab.label}
                  isActive={activeTab === tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  icon={tab.icon}
                />
              ))}
            </div>
            {activeTab === "Your feed" && (
              <div className="mb-4 flex justify-between items-center">
                <span
                  className="text-gray-600 font-medium"
                  style={{ fontWeight: "bold" }}
                >
                  Recent activity
                </span>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600"
                  onClick={() => setShowModal(true)}
                >
                  Create a group
                </button>
              </div>
            )}
            {activeTab === "Discover" && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <span
                    className="text-gray-600 font-medium"
                    style={{ fontWeight: "bold" }}
                  >
                    Suggested for you
                  </span>
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600"
                    onClick={() => setShowModal(true)}
                  >
                    Create a group
                  </button>
                </div>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    Group you might be interested in.
                  </span>
                </div>
              </>
            )}
            {activeTab === "Your groups" && (
              <div className="mb-4 flex justify-between items-center">
                <span
                  className="text-gray-600 font-medium"
                  style={{ fontWeight: "bold" }}
                >
                  All groups you have joined
                </span>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-600"
                  onClick={() => setShowModal(true)}
                >
                  Create a group
                </button>
              </div>
            )}

            {/* Create Group Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Group</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowModal(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    ALL FIELDS ARE REQUIRED UNLESS INDICATED.
                  </p>

                  <div className="mb-4">
                    <label className="block font-medium text-gray-700">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      maxLength={70}
                      className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a brief name"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {70 - groupName.length} characters left
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={250}
                      className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter what your group is all about"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {250 - description.length} characters left
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium text-gray-700">
                      Choose
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="privacy"
                          value="Public"
                          checked={privacy === "Public"}
                          onChange={(e) => setPrivacy(e.target.value)}
                          className="form-radio text-blue-500"
                        />
                        Public
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="privacy"
                          value="Private"
                          checked={privacy === "Private"}
                          onChange={(e) => setPrivacy(e.target.value)}
                          className="form-radio text-blue-500"
                        />
                        Private
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium text-gray-700">
                      Upload Image (OPTIONAL)
                    </label>
                    <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center mt-1">
                      <div className="flex justify-center mb-2">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16V12m0 0V8m0 4h4m-4 0H3m14-4v8m0 0v4m0-4h4m-4 0h-4"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-500">
                        Drag & drop file or{" "}
                        <span className="text-blue-500 cursor-pointer">
                          Browse
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleCreateGroup}
                  >
                    Submit
                  </button>
                  {message && (
                    <p className="mt-2 text-center text-sm">{message}</p>
                  )}
                </div>
              </div>
            )}

            {/* View Group Modal */}
            {showViewModal && selectedGroup && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Group Details</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowViewModal(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-4">
                    <Image
                      fill
                      src={
                        selectedGroup.admin.profilePicture ||
                        "/default-group.png"
                      }
                      alt={selectedGroup.name}
                      className="w-full h-48 rounded-lg object-cover mb-4"
                    />
                    <h3 className="text-lg font-semibold">
                      {selectedGroup.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedGroup.description || "No description available"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Admin: {selectedGroup.admin.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Members: {selectedGroup.memberCount || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(selectedGroup.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last Updated:{" "}
                      {new Date(selectedGroup.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-6 mb-4">
              {activeTab === "Discover" ? (
                groups.length > 0 ? (
                  groups.map((group) => (
                    <GroupCard
                      key={group._id}
                      group={group}
                      isDiscoverTab={true}
                    />
                  ))
                ) : (
                  <p className="text-gray-600">
                    No groups available to discover.
                  </p>
                )
              ) : activeTab === "Your groups" ? (
                userGroups.length > 0 ? (
                  userGroups.map((group) => (
                    <GroupCard
                      key={group._id}
                      group={group}
                      isDiscoverTab={false}
                    />
                  ))
                ) : (
                  <p className="text-gray-600">
                    You haven&apos;t joined any groups yet.
                  </p>
                )
              ) : (
                filteredPosts().map((post) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Groupspage;
