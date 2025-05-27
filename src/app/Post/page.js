"use client"
import React, { useState } from "react";
import useSidebarStore from "@/store/sidebarStore";
import LeftSideBar from "../components/LeftSideBar";
import toast from "react-hot-toast";

const Post = () => {
  const { isSidebarOpen } = useSidebarStore(); // Use sidebar store

  // State to manage form inputs
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Character limits
  const titleLimit = 70;
  const contentLimit = 280;
  const descriptionLimit = 350;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Post created successfully!");
    // Reset form
    setTitle("");
    setContent("");
    setDescription("");
    setImage(null);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      toast.success("Image uploaded!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        {/* Show LeftSideBar on mobile only if isSidebarOpen is true, always show on md and above */}
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}

        {/* Post Creation Form */}
        <div className="flex-1 p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Create Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
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
              <p className="text-sm text-muted-foreground mt-1">
                {titleLimit - title.length} characters left
              </p>
            </div>
            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-1">What on your mind?</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={contentLimit}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-500"
                rows="3"
                placeholder="Whats on your mind?"
              ></textarea>
              <p className="text-sm text-muted-foreground mt-1">
                {contentLimit - content.length} characters left
              </p>
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={descriptionLimit}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-500"
                rows="3"
                placeholder="Add more details about your post..."
              ></textarea>
              <p className="text-sm text-muted-foreground mt-1">
                {descriptionLimit - description.length} characters left
              </p>
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Add Image / Video (Optional)</label>
              <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded text-center">
                <div className="space-y-1">
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
                  <div className="flex text-sm text-gray-600">
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
                    <p className="pl-1">or drag & drop file</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Submit Button */}
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