"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PaymentButton from "./PaymentButton";
import { CiAt } from "react-icons/ci";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ImageIcon, Laugh, Plus, Video, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import userStore from "@/store/userStore";
import { usePostStore } from "@/store/usePostStore";
import Select from "react-select";
import StripeWrapper from "../Details/StripeWrapper";
import Image from "next/image";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const NewPostForm = ({ isPostFormOpen, setIsPostFormOpen, groups, pages }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = userStore();
  const [postContent, setPostContent] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleCreatePost } = usePostStore();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  console.log(selectedGroup,'selectedGroup_____')
  const [isFeatured, setIsFeatured] = useState(null);
  const [message1, setMessage1] = useState("");
  const [errMsg, setErrMsg] = useState("");

  console.log(selectedGroup, "groups_________");
  console.log(groups, "groups_________1");

  // Convert to options for react-select
  const options = groups?.map((group) => ({
    value: group._id,
    label: groups ? group.name : group.pageName,
    data: group,
  }));

  // On change
  const handleChange = (selectedOption) => {
    console.log("Selected group:", selectedOption.data);
    setSelectedGroup(selectedOption.data);
  };

  const fileInputRef = useRef(null);

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleEmojiClick = (emojiObject) => {
    setPostContent((prev) => prev + emojiObject.emoji);
  };

  const handleFileChnage = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileType(file.type);
    setFilePreview(URL.createObjectURL(file));
  };

const handlePost = async () => {
  try {
    if (isFeatured) {
      if (message1 !== "✅ Payment Successful!") {
        setErrMsg("Please make payment");
        return;
      }
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("content", postContent);

    if (selectedGroup?._id) {
      formData.append("groupId", selectedGroup._id);
    }

    if (selectedGroup?.name) {
      formData.append("groupName", selectedGroup.name);
    }

    if (pages && pages !== "undefined") {
      formData.append("pages", pages);
    }

    if (isFeatured) {
      formData.append("isFeatured", "isFeatured");
    }

    if (selectedFile) {
      formData.append("media", selectedFile);
    }

    const result = await handleCreatePost(formData);
    console.log(result);

    // Reset states
    setPostContent("");
    setSelectedFile(null);
    setFilePreview(null);
    setIsPostFormOpen(false);
    window.location.reload()
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

  return (
    <Card>
      <CardContent className="p-4 bg-white">
        <div className="flex space-x-4">
          <Avatar>
            {user?.profilePicture ? (
              <AvatarImage
                src={user?.profilePicture || "/placeholder.svg"}
                alt={user?.username}
              />
            ) : (
              <AvatarFallback className="dark:bg-gray-400">
                {userPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>

          <Dialog open={isPostFormOpen} onOpenChange={setIsPostFormOpen}>
            {/* Fix: Use asChild to prevent nested buttons */}
            <DialogTrigger asChild>
              <div className="w-full cursor-pointer">
                <Input
                  placeholder={`what's on your mind, ${user?.username}`}
                  readOnly
                  className="cursor-pointer rounded-full h-12 dark:bg-[rgb(58,59,60)] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <Separator className="my-2 dark:bg-slate-400" />
               <div className="flex justify-center items-center gap-4">
  {/* Photo/Video */}
  <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-4 py-2 cursor-pointer">
    <ImageIcon className="h-5 w-5 text-green-500 mr-2" />
    <span className="dark:text-slate-100">Photo/Video</span>
  </div>

  {/* Divider */}
<div className="w-0.5 h-6 bg-gray-400 dark:bg-gray-600" />

  {/* Mentions */}
  <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-4 py-2 cursor-pointer">
    <CiAt className="h-5 w-5 text-orange-500 mr-2" />
    <span className="dark:text-slate-100">Mentions</span>
  </div>
</div>

              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto bg-white dark:bg-white rounded-lg shadow-md">
              <DialogHeader>
                <DialogTitle className="text-center">Create Post</DialogTitle>
                {groups ? (
                  <div className="w-full max-w-md mx-auto mt-4">
                    <Select
                      options={options}
                      onChange={handleChange}
                      placeholder="Select a group"
                      isSearchable
                    />
                  </div>
                ) : (
                  ""
                )}
              </DialogHeader>
              <Separator />

              <div className="flex items-center space-x-3 py-4">
                <Avatar className="h-10 w-10">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture || "/placeholder.svg"}
                      alt={user?.username}
                    />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.username}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700">
                  Feature Listing
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isFeatured === true}
                      onChange={() => {
                        setIsFeatured(true);
                        console.log("Featured: true");
                      }}
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isFeatured === false}
                      onChange={() => {
                        setIsFeatured(false);
                        console.log("Featured: false");
                      }}
                    />
                    <span>Not Featured</span>
                  </label>
                </div>

                {isFeatured === true && (
                  <div className="mt-2 text-green-600">
                    <StripeWrapper>
                      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h1 className="text-xl font-bold mb-4">
                          Pay with Card
                        </h1>
                        <PaymentButton amount={5000} getMessage={setMessage1} />
                      </div>
                    </StripeWrapper>
                  </div>
                )}
              </div>

              <Textarea
                placeholder={`what's on your mind? ${user?.username}`}
                className="min-h-[100px] text-lg"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />

              <AnimatePresence>
                {(showImageUpload || filePreview) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setShowImageUpload(false);
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {filePreview ? (
                      fileType.startsWith("image") ? (
                        <Image
                          src={filePreview || "/placeholder.svg"}
                          alt="preview_img"
                          className="w-full h-auto max-h-[300px] object-cover"
                          width={300}
                          height={300}
                        />
                      ) : (
                        <video
                          controls
                          src={filePreview}
                          className="w-full h-auto max-h-[300px] object-cover"
                        />
                      )
                    ) : (
                      <>
                        <Plus
                          className="h-12 w-12 text-gray-400 mb-2 cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        />
                        <p className="text-center text-gray-500">
                          Add Photos/Videos
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChnage}
                      ref={fileInputRef}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-gray-200 dark:bg-muted p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">Add Your Post</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                  >
                    <ImageIcon className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                  >
                    <Video className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Laugh className="h-4 w-4 text-orange-500" />
                  </Button>
                </div>
              </div>

              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Picker onEmojiClick={handleEmojiClick} />
                </motion.div>
              )}

              {errMsg && (
                <div className="text-red-500 text-sm mt-2">{errMsg}</div>
              )}

              <div className="flex justify-end mt-4">
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handlePost}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewPostForm;
