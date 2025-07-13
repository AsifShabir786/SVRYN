"use client";
import React from "react";
import LeftSideBar from "../components/LeftSideBar";
import useSidebarStore from "@/store/sidebarStore";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const YourAds = () => {
  const { isSidebarOpen } = useSidebarStore();

  const dummyAds = [
    {
      id: 1,
      title: "Creative Clothing Design",
      price: "$35",
      date: "Listed on 18/4",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Exclusive Furniture For Your Home",
      price: "$205",
      date: "Listed on 15/4",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Enjoy Your Day With The Burger Pack",
      price: "$55",
      date: "Listed on 2/4",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      id: 4,
      title: "Home For Rent",
      price: "$950",
      date: "Listed on 1/4",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex flex-1 pt-16">
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
        <div
          className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto"
          style={{ width: "100%", maxWidth: "1600px" }}
        >
          <div className="lg:ml-2 xl:ml-28" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Ads</h2>
              <div className="flex items-center space-x-3">
              <Link href="/CreateAds">  
                <Button
                  className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Ads
                </Button>
                </Link>
                <Link href="/AdManager">
                  <Button
                    className="p-3 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out transform rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Back
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="text"
                placeholder="Search your ads"
                className="w-full p-2 border rounded-l-lg"
              />
              <Button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-r-lg hover:bg-gray-300">
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dummyAds.map((ad) => (
                <div key={ad.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  <Image
                    src={ad.image}
                    width={80}
                    height={80}

                    alt={ad.title}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{ad.title}</h3>
                    <p className="text-blue-600 font-bold">{ad.price}</p>
                    <p className="text-gray-500 text-sm">{ad.date}</p>
                  </div>
                  <Button className="mt-2 bg-blue-100 text-blue-700 py-1 px-2 rounded-lg hover:bg-blue-200">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Ads
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default YourAds;