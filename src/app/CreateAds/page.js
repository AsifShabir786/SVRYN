"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import LeftSideBar from "../components/LeftSideBar";
import useSidebarStore from "@/store/sidebarStore";
import { useRouter } from "next/navigation";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
const CreateAds = () => {
  const { isSidebarOpen } = useSidebarStore();
  const router = useRouter();
  const currentUser = localStorage.getItem("user-storage");
  // const staticUserId = currentUser?.state?.user?._id;
  var staticUserId = localStorage.getItem("userId");

  console.log(staticUserId, "groups_________39");
  const [campaignName, setCampaignName] = useState("");
  const [campaignDetails, setCampaignDetails] = useState("");
  const [tags, setTags] = useState([]);
  const [campaignType, setCampaignType] = useState("");
  const [budget, setBudget] = useState(10); // default budget
  const [duration, setDuration] = useState("30 days plan");
  const [mediaFile, setMediaFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  console.log("mediaFile_____", mediaFile);
  console.log("mediaFile_____1", duration);
  console.log("mediaFile_____2", budget);
  console.log("mediaFile_____3", campaignType);
  console.log("mediaFile_____4", tags);
  console.log("mediaFile_____5", campaignName);
  console.log("mediaFile_____6", campaignDetails);
  console.log("mediaFile_____7", selectedTags);

  // Update budget automatically based on selected duration
  useEffect(() => {
    const days = parseInt(duration.split(" ")[0]);
    const pricePer30Days = 10;
    const calculatedBudget = (days / 30) * pricePer30Days;
    setBudget(calculatedBudget);
  }, [duration]);
  const [mediaPreview, setMediaPreview] = useState(null);
  const allTags = [
    "Food Ads",
    "Products",
    "Chef",
    "Meal Plans",
    "Organic Promotions",
    "Restaurant Launch",
    "Recipe Videos",
    "Nutrition Tips",
    "Diet Campaigns",
    "Cooking Classes",
    "Beverage Ads",
  ];

  const filteredTags = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleSelect = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue("");
    setShowDropdown(false);
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTagChange = (tag) => {
    setTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // setMediaFile(file);
    // setMediaPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gptimages");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dgmjg9zr4/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setMediaPreview(data.secure_url);
        setMediaFile(data.secure_url);

        console.log("Uploaded to Cloudinary:", data.secure_url);
        // You can save the URL in state or send it to your backend
      } else {
        console.error("Cloudinary upload error:", data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newCampaign = {
  //     name: campaignName,
  //     details: campaignDetails,
  //     tags: Object.keys(tags).filter((key) => tags[key]),
  //     type: campaignType,
  //     budget,
  //     duration,
  //     media: mediaFile ? mediaFile.name : null,
  //   };
  //   // console.log("New Campaign Created:", newCampaign);
  //   // alert("Ad Campaign Created Successfully!");
  //   if (mediaPreview) {
  //     URL.revokeObjectURL(mediaPreview);
  //   }
  //   router.push("/Payment");
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("mediaFile_____", mediaFile);
    console.log("mediaFile_____1", duration);
    console.log("mediaFile_____2", budget);
    console.log("mediaFile_____3", campaignType);
    console.log("mediaFile_____4", selectedTags);
    console.log("mediaFile_____5", campaignName);
    console.log("mediaFile_____6", campaignDetails);
    console.log("mediaFile_____7", selectedTags);

    const formData = new FormData();
    formData.append("mediaUrl", mediaFile); // name should match multer field
    formData.append("duration", duration);
    formData.append("budget", budget);
    formData.append("campaignType", campaignType);
    formData.append("campaignName", campaignName);
    formData.append("campaignDetails", campaignDetails);
    formData.append("createdBy", staticUserId);

    selectedTags.forEach((tag) => formData.append("selectedTags[]", tag));

    try {
      const response = await axios.post(
        "http://82.221.139.203:9003/adsRoute/ads",
        formData,
        {
          headers: {
            "Content-Type": " application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`, // optional if using auth
          },
        }
      );

      console.log("Ad created:", response.data);
    } catch (error) {
      console.error(
        "Error creating ad:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex flex-1 pt-16">
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
        <div
          className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto"
          style={{ width: "100%", maxWidth: "1600px" }}
        >
          <div
            className="flex items-center justify-between mb-6 lg:ml-2 xl:ml-28"
            style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
          >
            <h2 className="text-2xl font-bold text-gray-900">
              New Ads Campaign
            </h2>
            <div className="flex items-center space-x-3">
              <Link href="/YourAds">
                <Button className="p-3 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out transform rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <X className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="lg:ml-2 xl:ml-28"
              style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
            >
              <label className="block text-gray-700 mb-1">Campaign Name</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Campaign Name"
                required
              />
            </div>

            <div
              className="lg:ml-2 xl:ml-28"
              style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
            >
              <label className="block text-gray-700 mb-1">
                Campaign Details
              </label>
              <textarea
                value={campaignDetails}
                onChange={(e) => setCampaignDetails(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Campaign Details"
                rows="4"
                required
              />
            </div>

            <div
              className="lg:ml-2 xl:ml-28"
              style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
            >
              <label className="block text-gray-700 mb-1">
                Add Campaign Tags
              </label>
              <p className="text-gray-500 text-sm mb-2">
                Campaign tags allow you to filter more effectively on the
                campaign view page
              </p>
              <div ref={containerRef} className="relative w-full  ">
                <div className="border rounded-lg p-2 bg-white">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <Cross2Icon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={inputValue}
                      onFocus={() => setShowDropdown(true)}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Select campaign types..."
                      className="flex-grow border-none outline-none px-2 py-1 text-sm min-w-[100px]"
                    />
                  </div>
                </div>

                {showDropdown && filteredTags.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 border rounded-md shadow-md bg-white max-h-40 overflow-auto z-20">
                    {filteredTags.map((tag) => (
                      <li
                        key={tag}
                        onClick={() => handleSelect(tag)}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div
              className="lg:ml-2 xl:ml-28"
              style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
            >
              <label className="block text-gray-700 mb-1">
                Select Campaign Type (Important)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    setCampaignType("Native");
                    setMediaFile(null);
                    setMediaPreview(null);
                  }}
                  className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center text-center ${
                    campaignType === "Native"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <svg
                    className="w-8 h-8 mb-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <p className="font-semibold">Native</p>
                  <p className="text-gray-500 text-sm">
                    This is an ads display as a news line
                  </p>
                </div>
                <div
                  onClick={() => setCampaignType("Display")}
                  className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center text-center ${
                    campaignType === "Display"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <svg
                    className="w-8 h-8 mb-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-semibold">Display</p>
                  <p className="text-gray-500 text-sm">
                    This ads display as a video media
                  </p>
                </div>
              </div>
            </div>

            {campaignType === "Display" && (
              <div
                className="lg:ml-2 xl:ml-28"
                style={{
                  width: "100%",
                  marginRight: "-3rem",
                  marginTop: "20px",
                }}
              >
                <label className="block text-gray-700 mb-1">
                  Add Image / Video
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {mediaPreview ? (
                    <div className="relative">
                      <img
                        src={mediaPreview}
                        alt="Media Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setMediaFile(null);
                          setMediaPreview(null);
                          URL.revokeObjectURL(mediaPreview);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className="w-8 h-8 mx-auto mb-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <p className="text-gray-500">Drag & drop file or</p>
                      <label className="text-blue-500 cursor-pointer">
                        Browse
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className="lg:ml-2 xl:ml-28"
              style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
            >
              <label className="block text-gray-700 mb-1">
                Campaign Budget & Time
              </label>
              <div className="flex space-x-2 items-center">
                {/* Duration Dropdown */}
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option>30 days plan</option>
                  <option>60 days plan</option>
                  <option>90 days plan</option>
                </select>

                {/* Read-only budget display */}
                <div className="relative">
                  <input
                    type="text"
                    value={`$${budget}`}
                    readOnly
                    className="p-2 w-32 border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 pointer-events-none">
                    USD
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="lg:ml-2 xl:ml-28 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 mt-2"
            >
              Proceed
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateAds;
