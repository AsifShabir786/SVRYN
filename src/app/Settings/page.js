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
  <main className="flex flex-col md:flex-row flex-1 pt-16">
    {/* Sidebar */}
    <div className="hidden md:block w-full md:w-64">
      <LeftSideBar />
    </div>

    {/* Settings Content */}
    <div className="flex-1 p-4 sm:p-6 md:p-10 w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 pb-4 gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Settings</h1>
        
        </div>
 
        {/* Conditional views */}
        {view === "accountInfo" && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Account Information</h2>
              <button onClick={() => setView("main")} className="text-gray-500 hover:text-gray-700 text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow">
              {/* Input Fields (use grid layout for responsiveness) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`mt-1 w-full p-2 rounded-lg border ${
                      isEditing ? "bg-gray-100" : "bg-gray-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`mt-1 w-full p-2 rounded-lg border ${
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
                  className={`mt-1 w-full p-2 rounded-lg border ${
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
                    className={`mt-1 w-full p-2 rounded-lg border ${
                      isEditing ? "bg-gray-100" : "bg-gray-200"
                    }`}
                    placeholder={isEditing ? "Enter new password" : "••••••••"}
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                    disabled={!isEditing}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={handleEdit}
                  disabled={isEditing}
                  className={`px-4 py-2 rounded-lg ${
                    isEditing
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isEditing || !isFormChanged}
                  className={`px-4 py-2 rounded-lg ${
                    isEditing && isFormChanged
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

   
      </div>
    </div>
  </main>
</div>

  );
};

export default Settings;