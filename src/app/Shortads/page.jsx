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
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../StripeCheckoutForm/page";
import { loadStripe } from '@stripe/stripe-js'; // Add this import

const stripePromise = loadStripe('pk_test_51Oqyo3Ap5li0mnBdxJiCZ4k0IEWVbOgGvyMbYB6XVUqYh1yNUEnRiX4e5UO1eces9kf9qZNZcF7ybjxg7MimKmUQ00a9s60Pa1');

const Shortads = () => {
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
  const [showProceedForm, setShowProceedForm] = useState(false);
  const [getMessage, setgetMessage] = useState(false);

const [extraField, setExtraField] = useState("");
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
        "http://localhost:9003/Adsadshort/ads",
        formData,
        {
          headers: {
            "Content-Type": " application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`, // optional if using auth
          },
        }
      );

      console.log("Ad created:", response.data);
      alert("Data added successfully")
        window.location.reload(); // This reloads the page after alert is closed

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
              Short Ads Manager
            </h2>
         
          </div>
 {showProceedForm && (
  <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
    <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
       

      <Elements stripe={stripePromise}>
        <StripeCheckoutForm getMessage={setgetMessage} amount={10} description={extraField} />
      </Elements>
       <Button
onClick={handleSubmit}          disabled={!getMessage}
          className="w-full bg-green-600 mt-4 text-white py-2 rounded hover:bg-green-700"
        >
          Submit
        </Button>
    </div>
  </div>
)}
     <form onSubmit={handleSubmit} className="relative">

  {/* ✔️ Description Field Appears at Top of the Form */}




  {/* ✔️ Continue with rest of your form fields */}
  <div className="lg:ml-2 xl:ml-28" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
    <label className="block text-gray-700 mb-1">Ads Name</label>
    <input
      type="text"
      value={campaignName}
      onChange={(e) => setCampaignName(e.target.value)}
      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      placeholder="Ads Name"
      required
    />
  </div>

  {/* ...other inputs... */}
  
  <div className="lg:ml-2 xl:ml-28" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
    <label className="block text-gray-700 mb-1">Add Image / Video</label>
    <div className="border-2 border-dashed rounded-lg p-4 text-center">
      {mediaPreview ? (
        <div className="relative">
          <video
            src={mediaPreview}
            controls
            autoPlay
            muted
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
              accept="video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  </div>

  {/* Ads Budget & Time */}
  <div className="lg:ml-2 xl:ml-28" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
    <label className="block text-gray-700 mb-1">Ads Budget & Time</label>
    <div className="flex space-x-2 items-center">
      <select
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option>30 days plan</option>
        <option>60 days plan</option>
        <option>90 days plan</option>
      </select>
      <div className="relative">
        <input
          type="text"
          value={`$${budget}`}
          readOnly
          className="p-2 w-32 border rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed"
        />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 pointer-events-none">USD</span>
      </div>
    </div>
  </div>

  {/* Proceed Button (shows the description form at top) */}
     <Button
      type="button"
      disabled={!mediaPreview}
      onClick={() => setShowProceedForm(true)}
      className="lg:ml-2 xl:ml-28 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 mt-4"
    >
      Proceed
    </Button>
 
</form>

        </div>
      </main>
    </div>
  );
};

export default Shortads;
