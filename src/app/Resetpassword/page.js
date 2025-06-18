"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation"; // Import usePathname to get path segments
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const router = useRouter();
    const searchParams = useSearchParams();
   const token = searchParams.get('token');
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname(); // Use usePathname to get the current URL path
  // const [token, setToken] = useState(null); // State to store the extracted token
console.log(token,'token_____')
   
  const resetPasswordSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const {
    register: registerResetPassword, // Renamed for clarity for the reset form
    handleSubmit: handleSubmitResetPassword, // Renamed for clarity
    reset: resetResetPasswordForm,
    formState: { errors: errorsResetPassword },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmitLinkSend = async (data) => { // Data will contain { password: "..." }
    setIsLoading(true);
    console.log(data.password, 'password_____');
    if (!token) {
      alert("Reset token is missing.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password/${token}`, // Correctly append the token
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: data.password }), // Access password from data object
        }
      );

      const result = await res.json();
      alert(result.message);
      if (res.ok) {
        router.push('/user-login'); // Redirect to login on successful password reset
      }
    } catch (err) {
      console.error("Reset password error:", err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Removed handleGoogleLogin and other unused useEffect for brevity,
  // as they are not directly related to the reset password functionality
  // you asked about. Keep them if they are part of your full application.

  return (
    <div
      className="min-h-screen flex items-center justify-between p-4 relative"
      style={{
        backgroundImage: `url("/images/login.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left side content - unchanged */}
      <div
        className="relative z-10 flex-1 max-w-lg text-white pl-8"
        style={{ marginLeft: "10rem" }}
      >
        <div className="space-y-6">
          <h1 className="text-6xl font-bold tracking-tight">SVRYN</h1>
          <h2 className="text-xl font-medium text-gray-200">
            Social media for creators, seekers, and truth-tellers.
          </h2>
          <p className="text-gray-300 leading-relaxed">
            No shadow bans. No data mining. No doomscrolling. Just reels,
            spaces, news, and ethical ads — all aligned with your values.
          </p>
          <p className="text-gray-300 leading-relaxed">
            No shadow bans, no tracking, no noise — just freedom to connect.
            Reels, spaces, news, and ethical ads, aligned with your values.
          </p>
         <button
              className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              onClick={() =>   router.push("/user-login")}
            >
              Log in
            </button>
        </div>
      </div>

      {/* Right side form */}
      <Card
        className="w-full max-w-sm bg-white/90 dark:text-black"
        style={{ marginRight: "10rem" }}
      >
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            <span>Enter Your New Password</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Use the correct form and handlers for reset password */}
          <form onSubmit={handleSubmitResetPassword(onSubmitLinkSend)}>
            <div className="space-y-2">
              <Input
                id="resetPassword" // Unique ID
                name="password"
                type="password"
                {...registerResetPassword("password")} // Use registerResetPassword
                placeholder="New Password"
                className="col-span-3 border-gray-300"
              />
              {errorsResetPassword.password && ( // Use errorsResetPassword
                <p className="text-red-500 text-sm">{errorsResetPassword.password.message}</p>
              )}
            </div>
            <div className="space-y-4 mt-4"> {/* Added margin-top for spacing */}
              <Button className="w-full bg-black text-white" type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;