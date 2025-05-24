"use client";
import React, { useState, useEffect } from "react";
import useSidebarStore from "@/store/sidebarStore";
import LeftSideBar from "../components/LeftSideBar";
import userStore from "@/store/userStore";
import { checkUserAuth } from "../../service/auth.service";

const Settings = () => {
  const { isSidebarOpen } = useSidebarStore();
  const { user, setUser } = userStore();
  const [view, setView] = useState("main");
  const [view1, setView1] = useState("main");

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Keep empty initially for security
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
  });
  const [isFormChanged, setIsFormChanged] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const authData = await checkUserAuth();
      if (authData.isAuthenticated && authData.user) {
        setUser(authData.user);
      }
    };
    fetchUserData();
  }, [setUser]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || "",
        email: user.email || "",
        password: "", // Do not populate password for security
        firstName: user.username ? user.username.split(" ")[0] : "",
        lastName: user.username ? user.username.split(" ")[1] || "" : "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      });
      setIsEditing(false);
      setIsFormChanged(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsFormChanged(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...(formData.password && { password: formData.password }),
        }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        setIsFormChanged(false);
        setFormData((prev) => ({ ...prev, password: "" }));
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex flex-1 pt-16">
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}

        {/* Settings Menu */}
   <div className="flex-1 p-6 md:p-10">
    <div className="max-w-3xl mx-auto"> {/* Adjusted width */}
            {view === "main" && view1 === "main" ? (
              <>
                {/* Main Settings View */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                  <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 w-48 rounded-full bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer"
                    onClick={() => setView("accountInfo")}
                  >
                    <span className="text-gray-700 font-medium">Account Information</span>
                    <span className="text-gray-500">➡️</span>
                  </div>
                  <div
                    className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer"
                    onClick={() => setView1("loginInfo")}
                  >
                    <span className="text-gray-700 font-medium">Login Information</span>
                    <span className="text-gray-500">➡️</span>
                  </div>
                  <div className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer">
                    <span className="text-gray-700 font-medium">Privacy Center</span>
                    <span className="text-gray-500">➡️</span>
                  </div>
                  <div className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer">
                    <span className="text-gray-700 font-medium">Add Payment Method</span>
                    <span className="text-gray-500">➡️</span>
                  </div>

                  {/* MORE Section */}
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">MORE</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer">
                        <span className="text-gray-700 font-medium">Media</span>
                        <span className="text-gray-500">➡️</span>
                      </div>
                      <div className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer">
                        <span className="text-gray-700 font-medium">Help</span>
                        <span className="text-gray-500">➡️</span>
                      </div>
                      <div className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer">
                        <span className="text-gray-700 font-medium">Ads Manager</span>
                        <span className="text-gray-500">➡️</span>
                      </div>
                      <div className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200 cursor-pointer">
                        <span className="text-gray-700 font-medium">Terms & Conditions</span>
                        <span className="text-gray-500">➡️</span>
                      </div>
                    </div>
                  </div>

                  {/* Log Out */}
                  <div className="mt-8">
                    <div className="flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow hover:bg-red-50 transition duration-200 cursor-pointer">
                      <span className="text-red-600 font-medium">Log Out</span>
                      <span className="text-gray-500">➡️</span>
                    </div>
                  </div>
                </div>
              </>
            ) : view === "accountInfo" ? (
              <>
                {/* Account Information View */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                  <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
                  <button
                    onClick={() => setView("main")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-2">Account Information</h2>
                      <div className="border-t border-gray-200 mt-2"></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                          isEditing ? "bg-gray-100" : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                          isEditing ? "bg-gray-100" : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <div className="flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={isEditing ? "Enter new password" : "••••••••"}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        />
                        <button
                          onClick={togglePasswordVisibility}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          disabled={!isEditing}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h2>
                      <div className="border-t border-gray-200 mt-2"></div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={handleEdit}
                        className={`px-4 py-2 rounded-lg ${
                          isEditing
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        disabled={isEditing}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleSave}
                        className={`px-4 py-2 rounded-lg ${
                          isEditing && isFormChanged
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isEditing || !isFormChanged}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : view1 === "loginInfo" ? (
              <>
                {/* Login Information View */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                  <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
                  <button
                    onClick={() => setView1("main")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-2">Login Information</h2>
                      <div className="border-t border-gray-200 mt-2"></div>
                    </div>
                      <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                          isEditing ? "bg-gray-100" : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <div className="flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={isEditing ? "Enter new password" : "••••••••"}
                          className={`mt-1 w-full p-2 rounded-lg border border-gray-200 ${
                            isEditing ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        />
                        <button
                          onClick={togglePasswordVisibility}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          disabled={!isEditing}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={handleEdit}
                        className={`px-4 py-2 rounded-lg ${
                          isEditing
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        disabled={isEditing}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleSave}
                        className={`px-4 py-2 rounded-lg ${
                          isEditing && isFormChanged
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isEditing || !isFormChanged}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;