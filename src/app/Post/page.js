"use client";

import React, { useState } from "react";
import useSidebarStore from "@/store/sidebarStore";
import LeftSideBar from "../components/LeftSideBar";
import toast from "react-hot-toast";
import { Globe, ChevronDown } from "lucide-react";
import axios from "axios";

const Post = () => {
  const { isSidebarOpen } = useSidebarStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState("Public");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const titleLimit = 70;
  const contentLimit = 280;
  const descriptionLimit = 350;

  const options = ["Public", "Friends", "Only me"];

  const handleCheckboxChange = (option) => {
    setSelectedPrivacy(option);
    console.log("Selected:", option);
    setModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      toast.success("Image uploaded!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    // formData.append("groupId", "undefined"); // Placeholder - replace with actual if needed
    // formData.append("groupName", "undefined"); // Placeholder - replace with actual if needed
    // formData.append("pages", "undefined"); // Placeholder - replace with actual if needed
    formData.append("isFeatured", ""); // Assuming not featured by default
    if (image) formData.append("media", image);

    try {
      const res = await axios.post("http://localhost:9003/postRoute/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Post creation error:", err);
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-col md:flex-row flex-1 pt-16">
        {(isSidebarOpen || typeof window !== "undefined" && window.innerWidth >= 768) && (
          <div className="w-full md:w-1/4 border-r border-gray-200">
            <LeftSideBar />
          </div>
        )}

        <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4">Create Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Privacy</label>
              <button
                type="button"
                className="flex items-center space-x-2 w-full border rounded px-3 py-1 hover:bg-gray-100"
                onClick={() => setModalOpen(true)}
              >
                <Globe className="w-4 h-4" />
                <span>{selectedPrivacy}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {modalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Privacy</h3>
                  <div className="space-y-3">
                    {options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPrivacy === option}
                          onChange={() => handleCheckboxChange(option)}
                          className="accent-blue-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-6 text-sm text-blue-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={titleLimit}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-500"
                placeholder="Title"
              />
              <p className="text-sm text-gray-500 mt-1">
                {titleLimit - title.length} characters left
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">What&apos;s on your mind?</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={contentLimit}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-500"
                rows="3"
                placeholder="Whats on your mind?"
              />
              <p className="text-sm text-gray-500 mt-1">
                {contentLimit - content.length} characters left
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={descriptionLimit}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-500"
                rows="3"
                placeholder="Add more details about your post..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {descriptionLimit - description.length} characters left
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Add Image / Video (Optional)</label>
              <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded text-center">
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center items-center gap-1">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Browse</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p>or drag & drop</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Post;