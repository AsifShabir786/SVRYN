"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useInputStore } from "@/store/useInputStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Loader from "@/lib/Loader";
import { logout } from "@/service/auth.service";
import { getAllUsers } from "@/service/user.service";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import {
  Bell,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  Users,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const searchRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, isSidebarOpen } = useSidebarStore();
  const router = useRouter();
  const { user, clearUser } = userStore();
  var userId = localStorage.getItem("userId");
  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");
  const { setInputValue } = useInputStore();

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleNavigation = (path, item) => {
    router.push(path);
    setActiveTab(item);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      // if (result?.status == "success") {
        router.push("/user-login");
        // clearUser();
      // }
      localStorage.removeItem('user-login')
      localStorage.removeItem('user-storage')
      localStorage.removeItem('token')


      toast.success("user logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error("failed to log out");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers();
        setUserList(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filterUser = userList.filter((user) =>
        user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilterUsers(filterUser);
      setIsSearchOpen(true);
    } else {
      setFilterUsers([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, userList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  const handleUserClick = async (userId) => {
    try {
      setLoading(true);
      setIsSearchOpen(false);
      setSearchQuery("");
      await router.push(`user-profile/${userId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClose = (e) => {
    if (!searchRef.current?.contains(e.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleSearchClose);
    return () => {
      document.removeEventListener("click", handleSearchClose);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <header className="bg-white dark:bg-gray-900 text-foreground h-24 fixed top-0 left-0 right-0 z-50 p-2">
      <div className="flex items-center md:justify-between p-2 relative">
        {/* Left Section: Toggler (Mobile) + Logo + DropdownMenu (Mobile Only) */}
        <div
          className="flex items-center gap-2 md:gap-4"
          style={{ width: "fit-content" }}
        >
          {/* Toggler Button for Mobile */}
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={toggleSidebar}
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </Button>
          <div
            className="cursor-pointer flex items-center"
            onClick={() => router.push("/")}
          >
            <Image
              src="/images/image.png"
              alt="App Logo"
              width={260}
              height={90}
              className="object-contain w-24 md:w-[260px]"
            />
          </div>
          {/* DropdownMenu (User Avatar) - Visible only in mobile */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-gray-500 dark:ring-gray-400 ring-offset-2 dark:ring-offset-gray-900">
                    {user?.profilePicture ? (
                      <AvatarImage
                        src={user?.profilePicture}
                        alt={user?.username}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
                        {userPlaceholder}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-600 rounded-xl mt-2 p-2 z-[9999] transition-all duration-200 ease-in-out"
                align="end"
              >
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3 ring-2 ring-gray-500 dark:ring-gray-400 ring-offset-2 dark:ring-offset-gray-800">
                        {user?.profilePicture ? (
                          <AvatarImage
                            src={user?.profilePicture}
                            alt={user?.username}
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
                            {userPlaceholder}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {user?.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-2" />
                <DropdownMenuItem
                  onClick={() => handleNavigation(`/user-profile/${userId}`)}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Users className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-gray-200">
                    Profile
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-2" />
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-900 dark:text-gray-200">
                        Dark Mode
                      </span>
                    </>
                  ) : (
                    <>
                      <Sun className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-900 dark:text-gray-200">
                        Light Mode
                      </span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-gray-200">
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Center Section: Search Bar (Hidden on Mobile) */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 hidden md:block"
          ref={searchRef}
        >
          <form onSubmit={handleSearchSubmit}>
            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{ background: "#dcdbcf" }}
            >
              <div className="p-2">
                <Search className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                className="px-3 py-2 w-64 md:w-96 focus:outline-none bg-[#dcdbcf]"
                placeholder="Search users..."
              />
            </div>
            {isSearchOpen && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50">
                <div className="p-2">
                  {filterUsers.length > 0 ? (
                    filterUsers.map((user) => (
                      <div
                        className="flex items-center space-x-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                        key={user._id}
                        onClick={() => handleUserClick(user?._id)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {user?.profilePicture ? (
                              <AvatarImage
                                src={user?.profilePicture}
                                alt={user?.username}
                              />
                            ) : (
                              <AvatarFallback>{userPlaceholder}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{user?.username}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No user Found</div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Section: Icons + DropdownMenu (Large Screens Only) */}
        <div className="hidden md:flex items-center md:space-x-4">
          <div className="flex items-center gap-2">
            {/* <div
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                activeTab === "home" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
              onClick={() => handleNavigation("/", "home")}
              title="Home"
            >
              <Home className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div> */}
            {/* <div
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                activeTab === "messages" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
              onClick={() => handleNavigation("/", "messages")}
              title="Messages"
            >
              <MessageCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : ""
              }`}
              onClick={() => handleNavigation("/", "notifications")}
              title="Notifications"
            >
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                activeTab === "videos" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
              onClick={() => handleNavigation("/", "videos")}
              title="Videos"
            >
              <Video className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div> */}
          </div>
          {/* DropdownMenu (User Avatar) - Visible only in large screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Avatar className="h-10 w-10 ring-2 ring-gray-500 dark:ring-gray-400 ring-offset-2 dark:ring-offset-gray-900">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
                      {userPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-600 rounded-xl mt-2 p-2 z-[9999] transition-all duration-200 ease-in-out"
              align="end"
            >
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3 ring-2 ring-gray-500 dark:ring-gray-400 ring-offset-2 dark:ring-offset-gray-800">
                      {user?.profilePicture ? (
                        <AvatarImage
                          src={user?.profilePicture}
                          alt={user?.username}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
                          {userPlaceholder}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {user?.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-2" />
              <DropdownMenuItem
                onClick={() => handleNavigation(`/user-profile/${userId}`)}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <Users className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-gray-200">
                  Profile
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-2" />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-gray-200">
                      Dark Mode
                    </span>
                  </>
                ) : (
                  <>
                    <Sun className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-gray-200">
                      Light Mode
                    </span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-gray-200">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
