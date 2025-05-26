"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { loginUser, registerUser } from "@/service/auth.service";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = yup.object().shape({
    username: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    dateOfBirth: yup.date().required("Birth date is required"),
    gender: yup
      .string()
      .oneOf(["male", "female", "other"], "please select a gender")
      .required("Gender is required"),
  });

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
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

  const onSubmitRegister = async (data) => {
    try {
      const result = await registerUser(data);
      if (result.status === "success") {
        router.push("/");
      }
      toast.success("User registered successfully");
    } catch (error) {
      console.error(error);
      toast.error("Email already exists");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitLogin = async (data) => {
    try {
      const result = await loginUser(data);
      if (result.status === "success") {
        router.push("/");
      }
      toast.success("User login successfully");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
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
        backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx6cIqNDLtHVStW2Tjz1radjXWcs3ELu6EBw&s")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left side content */}
      <div className="relative z-10 flex-1 max-w-lg text-white pl-8" style={{ marginLeft: "10rem" }}>
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
          {activeTab === "login" ? (
            <button
              className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          ) : (
            <button
              className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              onClick={() => setActiveTab("login")}
            >
              Log in
            </button>
          )}
        </div>
      </div>

      {/* Right side form */}
      <Card className="w-full max-w-sm bg-white/90 dark:text-black" style={{ marginRight: "10rem" }}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            <span>SVRYN SOCIAL</span>
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            {activeTab === "login" ? "Welcome back" : "Create an account"}
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger value="login" onClick={() => setActiveTab("login")}>
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setActiveTab("signup")}>
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmitLogin(onSubmitLogin)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="loginEmail"
                      name="email"
                      type="email"
                      {...registerLogin("email")}
                      placeholder="Email"
                      className="col-span-3 border-gray-300"
                    />
                    {errorsLogin.email && (
                      <p className="text-red-500 text-sm">{errorsLogin.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="loginPassword"
                      name="password"
                      type="password"
                      {...registerLogin("password")}
                      placeholder="Password"
                      className="col-span-3 border-gray-300"
                    />
                    {errorsLogin.password && (
                      <p className="text-red-500 text-sm">{errorsLogin.password.message}</p>
                    )}
                  </div>
                  <p className="text-right text-sm text-gray-600 cursor-pointer hover:underline">
                    Forget Password?
                  </p>
                  <Button className="w-full bg-black text-white" type="submit">
                    Login
                  </Button>
                </div>
              </form>
              <div className="relative w-full mt-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-[45%] border-t border-gray-300"></span>
                  <span className="w-[10%] text-center text-gray-500">or</span>
                  <span className="w-[45%] border-t border-gray-300"></span>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  className="w-12 h-12 rounded-full border-gray-300"
                  onClick={handleGoogleLogin}
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="w-12 h-12 rounded-full border-gray-300"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M16.37 3.07C15.37 1.92 14.07 1 12.5 1c-1.48 0-2.72.85-3.67 2.07-.85 1.1-1.45 2.55-1.45 4.13 0 1.48.45 2.85 1.22 3.97 1.1-1.45 2.55-2.65 4.13-2.65 1.58 0 3.03 1.2 4.13 2.65.77-1.12 1.22-2.5 1.22-3.97 0-1.58-.6-3.03-1.45-4.13zm-4.87 7.43c-2.1 0-4.13 1.8-4.13 4.13 0 2.33 1.8 4.13 4.13 4.13 2.33 0 4.13-1.8 4.13-4.13 0-2.33-1.8-4.13-4.13-4.13zm0 6.27c-1.18 0-2.13-.95-2.13-2.13s.95-2.13 2.13-2.13 2.13.95 2.13 2.13-.95 2.13-2.13 2.13z"
                      fill="#000000"
                    />
                  </svg>
                </Button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up.
                </span>
              </p>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmitSignUp(onSubmitRegister)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupName">Username</Label>
                    <Input
                      id="signupName"
                      name="username"
                      type="text"
                      {...registerSignUp("username")}
                      placeholder="Enter your username"
                      className="col-span-3 border-gray-300"
                    />
                    {errorsSignUp.username && (
                      <p className="text-red-500 text-sm">{errorsSignUp.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      name="email"
                      type="email"
                      {...registerSignUp("email")}
                      placeholder="Enter your email"
                      className="col-span-3 border-gray-300"
                    />
                    {errorsSignUp.email && (
                      <p className="text-red-500 text-sm">{errorsSignUp.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      name="password"
                      type="password"
                      {...registerSignUp("password")}
                      placeholder="Enter your Password"
                      className="col-span-3 border-gray-300"
                    />
                    {errorsSignUp.password && (
                      <p className="text-red-500 text-sm">{errorsSignUp.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupBirthday">Birthdate</Label>
                    <Input
                      id="signupBirthday"
                      name="dateOfBirth"
                      type="date"
                      {...registerSignUp("dateOfBirth")}
                      placeholder="Enter your Password"
                      className="col-span-3 border-gray-300"
                    />
                    {errorsSignUp.dateOfBirth && (
                      <p className="text-red-500 text-sm">{errorsSignUp.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      className="flex justify-between"
                      defaultValue="male"
                      {...registerSignUp("gender")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                    {errorsSignUp.gender && (
                      <p className="text-red-500 text-sm">{errorsSignUp.gender.message}</p>
                    )}
                  </div>
                  <Button className="w-full bg-black text-white" type="submit">
                    Sign Up
                  </Button>
                </div>
              </form>
              <div className="relative w-full mt-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-[45%] border-t border-gray-300"></span>
                  <span className="w-[10%] text-center text-gray-500">or</span>
                  <span className="w-[45%] border-t border-gray-300"></span>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  className="w-12 h-12 rounded-full border-gray-300"
                  onClick={handleGoogleLogin}
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="w-12 h-12 rounded-full border-gray-300"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M16.37 3.07C15.37 1.92 14.07 1 12.5 1c-1.48 0-2.72.85-3.67 2.07-.85 1.1-1.45 2.55-1.45 4.13 0 1.48.45 2.85 1.22 3.97 1.1-1.45 2.55-2.65 4.13-2.65 1.58 0 3.03 1.2 4.13 2.65.77-1.12 1.22-2.5 1.22-3.97 0-1.58-.6-3.03-1.45-4.13zm-4.87 7.43c-2.1 0-4.13 1.8-4.13 4.13 0 2.33 1.8 4.13 4.13 4.13 2.33 0 4.13-1.8 4.13-4.13 0-2.33-1.8-4.13-4.13-4.13zm0 6.27c-1.18 0-2.13-.95-2.13-2.13s.95-2.13 2.13-2.13 2.13.95 2.13 2.13-.95 2.13-2.13 2.13z"
                      fill="#000000"
                    />
                  </svg>
                </Button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => setActiveTab("login")}
                >
                  Log in.
                </span>
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;