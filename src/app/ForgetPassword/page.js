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

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLoginForm,
    formState: { errors: errorsLogin },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUpForm,
    formState: { errors: errorsSignUp },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [linkSent, setLinkSent] = useState(false);

  const onSubmitLinkSend = async (data) => {
    setIsLoading(true);
    setLinkSent(false); // reset before new attempt

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/request-reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setLinkSent(true); // show success message
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Reset link error:", err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  useEffect(() => {
    resetLoginForm();
    resetSignUpForm();
  }, [resetLoginForm, resetSignUpForm]);

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
      {/* Left side content */}
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
            onClick={() => router.push("/user-login")}
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
            <span>Forgot Your Password</span>
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            {activeTab === "login"
              ? "Enter your email address below, and we’ll send you a link to reset your password."
              : "Create an account"}
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} className="w-full">
            <div className="space-y-2">
              <Input
                style={{
                  borderRadius: "12px",
                  Height: "68.28px",
                }}
                id="loginEmail"
                name="email"
                type="email"
                {...registerLogin("email")}
                placeholder="Rachel781stinson@gmail.com"
                // className="col-span-3 border-gray-300"
                className="col-span-3 border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errorsLogin.email && (
                <p className="text-red-500 text-sm">
                  {errorsLogin.email.message}
                </p>
              )}
            </div>
            <TabsContent value="login">
              <form onSubmit={handleSubmitLogin(onSubmitLinkSend)}>
                <div className="space-y-4">
                  <Button className="w-full bg-black text-white" type="submit">
                    Request Link
                  </Button>

                  {linkSent && (
                    <p className="text-green-600 text-sm text-center mt-2">
                      Request Link sent Successfully! Please check your email.
                    </p>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
