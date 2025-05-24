"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import LeftSideBar from "../components/LeftSideBar";
import useSidebarStore from "@/store/sidebarStore";
import { useRouter } from "next/navigation";

const CreateAds = () => {
  const { isSidebarOpen } = useSidebarStore();
  const router = useRouter();

  const [campaignName, setCampaignName] = useState("");
  const [campaignDetails, setCampaignDetails] = useState("");
  const [tags, setTags] = useState({
    foodAds: false,
    products: false,
    chief: false,
  });
  const [campaignType, setCampaignType] = useState("");
  const [budget, setBudget] = useState(250);
  const [duration, setDuration] = useState("30 days plan");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleTagChange = (tag) => {
    setTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCampaign = {
      name: campaignName,
      details: campaignDetails,
      tags: Object.keys(tags).filter((key) => tags[key]),
      type: campaignType,
      budget,
      duration,
      media: mediaFile ? mediaFile.name : null,
    };
    // console.log("New Campaign Created:", newCampaign);
    // alert("Ad Campaign Created Successfully!");
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    router.push("/Payment");
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
            <h2 className="text-2xl font-bold text-gray-900">New Ads Campaign</h2>
            <div className="flex items-center space-x-3">
              <Link href="/YourAds">
                <Button
                  className="p-3 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out transform rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
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
              <label className="block text-gray-700 mb-1">Campaign Details</label>
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
              <label className="block text-gray-700 mb-1">Add Campaign Tags</label>
              <p className="text-gray-500 text-sm mb-2">
                Campaign tags allow you to filter more effectively on the campaign view page
              </p>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  onClick={() => handleTagChange("foodAds")}
                  className={`flex items-center px-3 py-1 rounded-lg border ${
                    tags.foodAds ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Food Ads {tags.foodAds && <X className="w-4 h-4 ml-1" />}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTagChange("products")}
                  className={`flex items-center px-3 py-1 rounded-lg border ${
                    tags.products ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Products {tags.products && <X className="w-4 h-4 ml-1" />}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTagChange("chief")}
                  className={`flex items-center px-3 py-1 rounded-lg border ${
                    tags.chief ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Chief {tags.chief && <X className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>

            <div
              className="lg:ml-2 xl:ml-28"
              style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
            >
              <label className="block text-gray-700 mb-1">Select Campaign Type (Important)</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    setCampaignType("Native");
                    setMediaFile(null);
                    setMediaPreview(null);
                  }}
                  className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center text-center ${
                    campaignType === "Native" ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
                  <p className="text-gray-500 text-sm">This is an ads display as a news line</p>
                </div>
                <div
                  onClick={() => setCampaignType("Display")}
                  className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center text-center ${
                    campaignType === "Display" ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
                  <p className="text-gray-500 text-sm">This ads display as a video media</p>
                </div>
              </div>
            </div>

            {campaignType === "Display" && (
              <div
                className="lg:ml-2 xl:ml-28"
                style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
              >
                <label className="block text-gray-700 mb-1">Add Image / Video</label>
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
              <label className="block text-gray-700 mb-1">Campaign Budget & Time</label>
              <div className="flex space-x-2">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option>30 days plan</option>
                  <option>60 days plan</option>
                  <option>90 days plan</option>
                </select>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  min="1"
                  required
                />
                <span className="flex items-center text-gray-700">$</span>
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