"use client"
import React, { useEffect, useState } from "react";
import RightSideBar from "../components/RightSideBar";
import StorySection from "@/app/story/StorySection";
import NewPostForm from "../posts/NewPostForm";
import PostCard from "../posts/PostCard";
import { usePostStore } from "@/store/usePostStore";
import toast from "react-hot-toast";
import { Send } from 'lucide-react';
import useSidebarStore from "@/store/sidebarStore";
import LeftSideBar from "../components/LeftSideBar";

const Pages = () => {
  const { isSidebarOpen } = useSidebarStore(); // Use sidebar store

  // State to manage form inputs
  const [pageName, setPageName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Character limits
  const pageNameLimit = 70;
  const categoryLimit = 150;
  const descriptionLimit = 350;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Page created successfully!");
    // Reset form
    setPageName("");
    setCategory("");
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

        {/* Page Creation Form */}
        <div className="flex-1 p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Create a Page</h1>
          <p className="text-muted-foreground mb-6">
            Your Page is where people go to learn more about you. Make sure yours has all the information they need.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Page Name */}
            <div>
              <label htmlFor="pageName" className="block text-sm font-medium">
                Page Name
              </label>
              <input
                type="text"
                id="pageName"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                maxLength={pageNameLimit}
                placeholder="Use the name that helps explain your Page"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring focus:ring-blue-500"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {pageNameLimit - pageName.length} characters left
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={categoryLimit}
                placeholder="Enter a category that best describes you."
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring focus:ring-blue-500"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {categoryLimit - category.length} characters left
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={descriptionLimit}
                placeholder="Tell people a little about what you do."
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring focus:ring-blue-500"
                rows="4"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {descriptionLimit - description.length} characters left
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium">
                Upload Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
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
                        accept="image/*"
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
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Pages;