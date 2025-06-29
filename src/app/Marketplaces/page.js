"use client";
import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { Search, Grid, Plus, Store } from "lucide-react";
import useSidebarStore from "@/store/sidebarStore";
import { useInputStore } from "@/store/useInputStore";
import Link from "next/link";
import { Star } from "lucide-react";
import PaymentButton from "../Details/PaymentButton";
import StripeWrapper from "../Details/StripeWrapper";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const Marketplaces = () => {
  const { isSidebarOpen } = useSidebarStore();
  const { inputValue } = useInputStore();
  const [refresh, setRefresh] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message1, setMessage1] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [message, setMessage] = useState("");
  const [showUserListings, setShowUserListings] = useState(false); // New state for user listings page

  const currentUser = JSON.parse(localStorage.getItem("user-storage"));
  // const staticUserId = currentUser?.state?.user?._id;
  var staticUserId = localStorage.getItem("userId");

  const token = localStorage.getItem("token");
  const sellerName = localStorage.getItem("username");
  const _id = localStorage.getItem("userId");

  const searchParams = useSearchParams();
  // const _id = searchParams.get("id");
  const categoryOptions = [
    "Tools",
    "Furniture",
    "Household",
    "Garden",
    "Appliances",
    "Entertainment",
    "Video Games",
    "Books, Films, Music",
    "Luggage",
    "Women's Dressing",
    "Men's Dressing",
    "Jewellery",
    "Health Care",
    "Pet supplies",
    "Baby Care",
    "Toys",
    "Games",
    "Electronics",
    "Bicycles",
    "Arts",
    "Sports and Games",
    "Cars",
    "Cars Parts",
  ];

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          `https://fb-backend.vercel.app/MarketPlace/ListingsBySellerId/${_id}`
        );
        const data = await response.json();
        console.log("Fetched data:12", data);
        if (data.status === "success") {
          setPosts(data.data);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        setMessage("❌ Failed to fetch listings");
      }
    };

    fetchListings();
  }, [refresh]);

  // Filter posts for the logged-in user
  const userListings = posts.filter((post) => post.sellerId === staticUserId);

  // Handle category checkbox changes
  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImages(files);
    setUploading(true);

    const uploadedUrls = [];
    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "gptimages");
        formData.append("cloud_name", "dgmjg9zr4");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dgmjg9zr4/image/upload",
          formData
        );
        uploadedUrls.push(res.data.secure_url);
      }
      setImageUrls(uploadedUrls);
    } catch (err) {
      console.error("Image upload failed:", err);
      setErrMsg("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateListing = async () => {
    if (
      !title ||
      !description ||
      !phoneNumber ||
      !condition ||
      !price ||
      selectedOptions.length === 0
    ) {
      setErrMsg("Please fill in all required fields, including phone number");
      return;
    }
    if (isFeatured && message1 !== "✅ Payment Successful!") {
      setErrMsg("Please complete the payment for featured listing");
      return;
    }
    if (!sellerName) {
      setErrMsg("Seller name is required");
      return;
    }
    if (!staticUserId) {
      setErrMsg("Seller ID is missing");
      return;
    }

    try {
      const response = await axios.post(
        "https://fb-backend.vercel.app/MarketPlace/marketplace",
        {
          sellerName,
          title,
          sellerId: staticUserId,
          description,
          category: selectedOptions,
          PhoneNumber: phoneNumber,
          condition,
          isFeatured,
          price,
          imageUrl: imageUrls,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh(true);
      setMessage("✅ Product Listed Successfully!");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setPhoneNumber("");
      setSelectedOptions([]);
      setCondition("");
      setPrice("");
      setImages([]);
      setImageUrls([]);
      setIsFeatured(false);
      setErrMsg("");
      setMessage1("");
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
      setMessage(
        `❌ Failed to create listing: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleSellClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setPhoneNumber("");
    setSelectedOptions([]);
    setCondition("");
    setPrice("");
    setImages([]);
    setImageUrls([]);
    setUploading(false);
    setErrMsg("");
    setMessage("");
    setMessage1("");
    setIsFeatured(false);
  };

  // Handle showing user listings
  const handleShowUserListings = () => {
    setShowUserListings(true);
  };

  // Handle closing user listings page
  const handleCloseUserListings = () => {
    setShowUserListings(false);
  };

  // Handle marking as sold
  const handleMarkAsSold = async (postId) => {
    try {
      await axios.put(
        `https://fb-backend.vercel.app/MarketPlace/marketplace/${postId}`,
        { sold: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error marking as sold:", err);
      setMessage("❌ Failed to mark as sold");
    }
  };

  // Handle deleting a listing
  const handleDeleteListing = async (postId) => {
    try {
      await axios.delete(
        `https://fb-backend.vercel.app/MarketPlace/marketplace/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error deleting listing:", err);
      setMessage("❌ Failed to delete listing");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesTitle = post.title
      .toLowerCase()
      .includes(inputValue.toLowerCase());
    const matchesServiceType = selectedOption
      ? post.category.some(
          (cat) => cat.toLowerCase() === selectedOption.toLowerCase()
        )
      : true;
    const matchesPriceFrom = priceFrom
      ? post.price >= parseFloat(priceFrom)
      : true;
    const matchesPriceTo = priceTo ? post.price <= parseFloat(priceTo) : true;
    return (
      matchesTitle && matchesServiceType && matchesPriceFrom && matchesPriceTo
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
            {!showUserListings ? (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Marketplace
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      className="p-3 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      aria-label="Marketplace options"
                      onClick={handleShowUserListings} // Added onClick handler
                    >
                      <Store className="w-5 h-5" />
                    </button>
                    <button
                      className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                      onClick={handleSellClick}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Sell Something
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Find what you need"
                    className="flex-1 p-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-300"
                  />
                  <button className="px-5 py-3 bg-gray-200 text-gray-700 rounded-r-xl hover:bg-gray-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <Link href={`/Details?id=${post._id}`} key={post._id}>
                        <div
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 cursor-pointer"
                          style={{ marginTop: "20px" }}
                        >
                          {post.imageUrl?.[0] ? (
                            <img
                              src={post.imageUrl[0]}
                              alt={post.title}
                              className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                              No Image
                            </div>
                          )}
                          <div className="space-y-1">
                            <h2 className="font-semibold text-base truncate">
                              {post.title}
                            </h2>
                            <p className="text-blue-600 font-bold text-sm">
                              ${post.price}
                            </p>
                            <div className="flex items-center space-x-1">
                              {[...Array(4)].map((_, index) => (
                                <Star
                                  key={index}
                                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                              <Star
                                className="w-4 h-4 text-yellow-400"
                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                fill="currentColor"
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                4.5
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                              {post.category?.join(", ")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-8">
                      No posts found.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // User Listings Page
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Listings
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                      onClick={handleSellClick}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create new listing
                    </button>
                    <button className="p-3 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out transform rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      Back
                    </button>
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <input
                    type="text"
                    placeholder="Search your listings"
                    className="flex-1 p-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-300"
                  />
                  <button className="px-5 py-3 bg-gray-200 text-gray-700 rounded-r-xl hover:bg-gray-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userListings.length > 0 ? (
                    userListings.map((post) => (
                      <div
                        key={post._id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3"
                      >
                        {post.imageUrl?.[0] ? (
                          <img
                            src={post.imageUrl[0]}
                            alt={post.title}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                            No Image
                          </div>
                        )}
                        <div className="space-y-1">
                          <h2 className="font-semibold text-base truncate">
                            {post.title}
                          </h2>
                          <p className="text-blue-600 font-bold text-sm">
                            ${post.price}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Listed on{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-3 flex justify-between">
                          <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out"
                            onClick={() => handleMarkAsSold(post._id)}
                            disabled={post.sold}
                          >
                            Mark as sold
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
                            onClick={() => handleDeleteListing(post._id)}
                          >
                            Delete listing
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-8 col-span-full">
                      No listings found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Selling Something */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div
            className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg relative"
            style={{ margin: "2rem 0" }}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl font-semibold"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Sell Your Product</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter product title"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter product description"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">
                Feature Listing
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isFeatured === true}
                    onChange={() => setIsFeatured(true)}
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isFeatured === false}
                    onChange={() => setIsFeatured(false)}
                  />
                  <span>Not Featured</span>
                </label>
              </div>
              {isFeatured && (
                <div className="mt-2">
                  <StripeWrapper>
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                      <h1 className="text-xl font-bold mb-4">Pay with Card</h1>
                      <PaymentButton amount={5000} getMessage={setMessage1} />
                    </div>
                  </StripeWrapper>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">
                Categories
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto mt-2 border rounded p-2">
                {categoryOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium text-gray-700">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Old">Old</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border px-3 py-2 rounded mt-1"
              />
              {uploading && (
                <p className="text-sm text-blue-600 mt-2">
                  Uploading images...
                </p>
              )}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>
            {errMsg && <span style={{ color: "red" }}>{errMsg}</span>}
            {message && (
              <span style={{ color: message.includes("✅") ? "green" : "red" }}>
                {message}
              </span>
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={handleCreateListing}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "+ Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplaces;
