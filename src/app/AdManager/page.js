"use client";
import React, { useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import useSidebarStore from "@/store/sidebarStore";
import { Button } from "@/components/ui/button";
import { Grid, Store, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { DataGrid } from "@mui/x-data-grid";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdManager = () => {
  const { isSidebarOpen } = useSidebarStore();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleCreateAds = () => {
    alert("Create Ads functionality to be implemented!");
  };

  const tabs = [
    { name: "Dashboard", icon: <Grid className="w-5 h-5 mr-2" /> },
    { name: "Campaign", icon: <Store className="w-5 h-5 mr-2" /> },
    {
      name: "Performance",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-4v4m-4-8v8m-4-4v4" />
        </svg>
      ),
    },
    {
      name: "Audience",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.5c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 0c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      ),
    },
  ];

  // Chart data for Total Spent
  const totalSpentData = {
    labels: ["18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
    datasets: [
      {
        label: "Spending",
        data: [25, 30, 25, 50, 60, 75, 90, 75, 50, 60, 40, 30, 50, 60],
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    ],
  };

  const totalSpentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value}%`,
        },
        title: {
          display: true,
          text: "Spending (%)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Chart data for Conversation over Time
  const conversationData = {
    labels: ["18", "19", "20", "21", "22", "23", "24", "25", "26", "27"],
    datasets: [
      {
        label: "Conversations",
        data: [50, 60, 70, 40, 30, 50, 70, 80, 60, 40],
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    ],
  };

  const conversationOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Conversations (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Data Grid columns
  const columns = [
    { field: "campaign", headerName: "Campaign", width: 200 },
    { field: "impressions", headerName: "Impressions", width: 150 },
    { field: "clicks", headerName: "Clicks", width: 150 },
    { field: "cpc", headerName: "CPC", width: 150 },
    { field: "spend", headerName: "Spend", width: 150 },
  ];

  // Data Grid rows
  const rows = [
    { id: 1, campaign: "Creative Clothing...", impressions: 1898, clicks: 560, cpc: "$8.12", spend: "$2,253.52" },
    { id: 2, campaign: "Exclusive Furniture...", impressions: 267, clicks: 230, cpc: "$3.12", spend: "$721.10" },
    { id: 3, campaign: "Burger Pack", impressions: 1956, clicks: 156, cpc: "$5.12", spend: "$9,523.44" },
    { id: 4, campaign: "Home For Sale", impressions: 1564, clicks: 28, cpc: "$12.12", spend: "$1,421.76" },
  ];

  // Performance Chart Data (New for Performance Tab)
  const performanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [20, 30, 40, 50, 75, 60, 55, 45, 50, 60, 70, 65], // Adjusted to reflect $1,472.35 peak
        backgroundColor: "#e0e0e7",
        borderColor: "#ff6384",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value}%`,
        },
        title: {
          display: true,
          text: "Percentage",
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: "May",
            borderColor: "rgba(255, 99, 132, 0.7)",
            borderWidth: 2,
            label: {
              enabled: true,
              content: "$1,472.35",
              position: "top",
            },
          },
        ],
      },
    },
  };

  // Publisher Performance Doughnut Chart Data (New for Performance Tab)
  const publisherData = {
    labels: ["Total Profit", "Impressions", "Clicks", "CPC", "Purchase", "Product Cashouts"],
    datasets: [
      {
        data: [5208.16, 24.6, 3.1, 2.2, 3.2, 1.8], // Adjusted to match the image
        backgroundColor: ["#3b82f6", "#a3bffa", "#bfdbfe", "#dbeafe", "#eff6ff", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const publisherOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex flex-1 pt-16">
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
        <div
          className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-none xl:max-w-none mx-auto"
          style={{ width: "100%" }}
        >
          <div className="lg:ml-2 xl:ml-28" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ads Manager</h2>
              <div className="flex items-center space-x-3">
                <Link href="/YourAds">
                  <Button
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Your Ads
                  </Button>
                </Link>
                <Link href="/CreateAds">  
                <Button
                  className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Ads
                </Button>
                </Link>
                <Link href="/Ads">
                  <Button
                    className="p-3 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out transform rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Back
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mb-6 flex flex-wrap gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`flex-1 min-w-[150px] flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    activeTab === tab.name
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              {activeTab === "Dashboard" && (
                <div>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Total Campaign</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Today Revenue</p>
                      <p className="text-2xl font-bold">$5,268.16</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Today Sessions</p>
                      <p className="text-2xl font-bold">26k</p>
                      <p className="text-sm text-gray-600">528 Visitors</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Subscribers</p>
                      <p className="text-2xl font-bold">192</p>
                      <p className="text-sm text-gray-600">$16.25 Avg Order</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">Total Spent</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span>Last 30 days</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                    <div className="lg:ml-2 xl:ml-28 h-64" style={{ width: "80%", marginRight: "-3rem" }}>
                      <Bar data={totalSpentData} options={totalSpentOptions} />
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Campaign Performance</h3>
                    <div style={{ height: 400, width: "90%" }}>
                      <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        sx={{
                          "& .MuiDataGrid-root": {
                            border: "none",
                          },
                          "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid #e0e0e0",
                          },
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f7fafc",
                            borderBottom: "1px solid #e0e0e0",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Conversation over Time</h3>
                    <div className="lg:ml-2 xl:ml-28 h-96" style={{ width: "100%", marginRight: "0" }}>
                      <Bar data={conversationData} options={conversationOptions} />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "Campaign" && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">4 Active Campaigns</h3>
                    <a href="#" className="text-blue-500 text-sm font-medium hover:underline">See All</a>
                  </div>
                  <div style={{ height: 400, width: "90%" }}>
                    <DataGrid
                      rows={[
                        { id: 1, campaign: <div className="flex items-center"><img src="https://via.placeholder.com/40?text=Cloth" alt="Creative Clothing" className="mr-2 w-10 h-10 rounded" />Creative Clothing... <span className="text-gray-500 text-xs ml-2">(Listed on 18-09-24)</span></div>, impressions: 1898, clicks: 560, cpc: "$8.12", spend: "$2,253.52" },
                        { id: 2, campaign: <div className="flex items-center"><img src="https://via.placeholder.com/40?text=Furn" alt="Exclusive Furniture" className="mr-2 w-10 h-10 rounded" />Exclusive Furniture... <span className="text-gray-500 text-xs ml-2">(Listed on 18-09-24)</span></div>, impressions: 267, clicks: 230, cpc: "$3.12", spend: "$721.10" },
                        { id: 3, campaign: <div className="flex items-center"><img src="https://via.placeholder.com/40?text=Burger" alt="Burger Pack" className="mr-2 w-10 h-10 rounded" />Burger Pack <span className="text-gray-500 text-xs ml-2">(Listed on 02-09-24)</span></div>, impressions: 1956, clicks: 156, cpc: "$5.12", spend: "$9,523.44" },
                        { id: 4, campaign: <div className="flex items-center"><img src="https://via.placeholder.com/40?text=House" alt="Home For Sale" className="mr-2 w-10 h-10 rounded" />Home For Sale <span className="text-gray-500 text-xs ml-2">(Listed on 01-09-24)</span></div>, impressions: 1564, clicks: "2k", cpc: "$12.12", spend: "$1,421.76" },
                      ]}
                      columns={[
                        { field: "campaign", headerName: "Campaign", width: 300, renderCell: (params) => params.value },
                        { field: "impressions", headerName: "Impressions", width: 150 },
                        { field: "clicks", headerName: "Clicks", width: 150 },
                        { field: "cpc", headerName: "CPC", width: 150 },
                        { field: "spend", headerName: "Spend", width: 150 },
                      ]}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      sx={{
                        "& .MuiDataGrid-root": {
                          border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "1px solid #e0e0e0",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#f7fafc",
                          borderBottom: "1px solid #e0e0e0",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  </div>
                </div>
              )}
              {activeTab === "Performance" && (
                <div>
                  <div className="mb-6">
                    <h3 className="font-bold text-lg">Performance</h3>
                    <div className="h-64" style={{ width: "90%" }}>
                      <Bar data={performanceData} options={performanceOptions} />
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-bold text-lg">Publisher Performance</h3>
                    <div className="flex items-center">
                      <div className="w-1/3 h-64">
                        <Doughnut data={publisherData} options={publisherOptions} />
                      </div>
                      <div className="w-2/3 pl-6">
                        <p>Total Profit: <span className="font-bold">$5,208.16</span></p>
                        <p>Impression: <span className="font-bold">24.6K</span></p>
                        <p>Click: <span className="font-bold">3.1K</span></p>
                        <p>CPC: <span className="font-bold">2.2K</span></p>
                        <p>Purchase: <span className="font-bold">3.2K</span></p>
                        <p>Product Cashouts: <span className="font-bold">1.8K</span></p>
                        <a href="#" className="text-blue-500 text-sm font-medium hover:underline">See All</a>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-bold text-lg">Top Performance A-hds</h3>
    <a href="#" className="text-blue-500 text-sm font-medium hover:underline">Sell All</a>
  </div>
  <div className="flex space-x-4 w-full">
    <div className="bg-gray-200 p-4 rounded-lg text-center flex-1">
      <img
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&w=100&h=100&fit=crop"
        alt="Home For Sale"
        className="mb-2 w-full h-auto object-cover"
      />
      <p>Home For Sale</p>
    </div>
    <div className="bg-gray-200 p-4 rounded-lg text-center flex-1">
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&w=100&h=100&fit=crop"
        alt="Creative Clothes"
        className="mb-2 w-full h-auto object-cover"
      />
      <p>Creative Clothes</p>
    </div>
    <div className="bg-gray-200 p-4 rounded-lg text-center flex-1">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=100&h=100&fit=crop"
        alt="Burger"
        className="mb-2 w-full h-auto object-cover"
      />
      <p>Burger</p>
    </div>
  </div>
</div>
                </div>
              )}
             {activeTab === "Audience" && (
  <div>
    {/* Funnel and Metrics Section */}
    <div className="flex items-center mb-6">
      <div className="w-1/3">
        <h3 className="font-bold text-lg mb-2">Publisher Performance</h3>
        {/* Placeholder for funnel visualization - Chart.js doesn't support funnel charts directly */}
        <div className="relative h-40 w-40 mx-auto">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-20 bg-green-400 rounded-t-lg" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)" }}></div>
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-4/5 h-10 bg-yellow-400" style={{ clipPath: "polygon(20% 0, 80% 0, 60% 100%, 40% 100%)" }}></div>
          <div className="absolute top-30 left-1/2 transform -translate-x-1/2 w-3/5 h-10 bg-orange-400 rounded-b-lg" style={{ clipPath: "polygon(40% 0, 60% 0, 60% 100%, 40% 100%)" }}></div>
        </div>
      </div>
      <div className="w-2/3 pl-6">
        <div className="flex items-center mb-2">
          <p className="text-sm text-gray-600 w-20">CPC</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
          </div>
          <p className="ml-4 font-bold">2.2K</p>
        </div>
        <div className="flex items-center mb-2">
          <p className="text-sm text-gray-600 w-20">CPM</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="ml-4 font-bold">5.2K</p>
        </div>
        <div className="flex items-center mb-2">
          <p className="text-sm text-gray-600 w-20">CTR</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
          </div>
          <p className="ml-4 font-bold">3.1K</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-gray-600 w-20">ROAS</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "55%" }}></div>
          </div>
          <p className="ml-4 font-bold">3.4K</p>
        </div>
      </div>
    </div>

    {/* Traffic Section with Doughnut Chart */}
    <div className="flex items-center mb-6">
      <div className="w-1/2">
        <h3 className="font-bold text-lg mb-2">Traffic</h3>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
            <p>Direct <span className="font-bold">2.1K (35%)</span></p>
          </div>
          <div className="flex items-center mr-4">
            <span className="w-3 h-3 bg-gray-300 rounded-full mr-1"></span>
            <p>Referral <span className="font-bold">1.3K (15%)</span></p>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
            <p>Paid <span className="font-bold">4.6K (50%)</span></p>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-64 relative">
        <Doughnut
          data={{
            labels: ["Direct", "Referral", "Paid"],
            datasets: [
              {
                data: [35, 15, 50],
                backgroundColor: ["#ff6384", "#e0e0e0", "#ffcd56"],
                borderWidth: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              doughnutLabel: {
                labels: [
                  {
                    text: "100%",
                    font: {
                      size: "20",
                      weight: "bold",
                    },
                    color: "#000",
                  },
                  {
                    text: "Commitment",
                    font: {
                      size: "14",
                    },
                    color: "#666",
                  },
                ],
              },
            },
            cutout: "70%", // Makes it a thinner ring
          }}
        />
      </div>
    </div>

    {/* Demographics Table */}
    <div>
      <h3 className="font-bold text-lg mb-2">Demographics</h3>
      <div style={{ height: 400, width: "90%" }}>
        <DataGrid
          rows={[
            { id: 1, country: "USA", age: "20-31", gender: "Male", cpc: "$223.52", revenue: "$373.14", purchase: "$223.52" },
            { id: 2, country: "Germany", age: "17-25", gender: "Female", cpc: "$723.10", revenue: "$723.10", purchase: "$723.11" },
            { id: 3, country: "China", age: "15-18", gender: "Male", cpc: "$53.34", revenue: "$723.34", purchase: "$9,523" },
            { id: 4, country: "Italy", age: "25-35", gender: "Male", cpc: "$121.76", revenue: "$1,421.76", purchase: "$1,421" },
          ]}
          columns={[
            { field: "country", headerName: "Country", width: 150 },
            { field: "age", headerName: "Age", width: 150 },
            { field: "gender", headerName: "Gender", width: 150 },
            { field: "cpc", headerName: "CPC", width: 150 },
            { field: "revenue", headerName: "Revenue", width: 150 },
            { field: "purchase", headerName: "Purchase", width: 150 },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f7fafc",
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "0.75rem",
            },
          }}
        />
      </div>
  
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

export default AdManager;