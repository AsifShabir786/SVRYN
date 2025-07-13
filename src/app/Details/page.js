"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, MessageCircleMore } from "lucide-react";
import userStore from "@/store/userStore";
import CreateGroupPage from "./CreateGroupPage ";

const Details = () => {
  const [posts, setposts] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { user } = userStore();
  console.log(user,'user_______')
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        try {
          const response = await fetch(`http://localhost:9003/marketplace/marketplace/${id}`);
          const data = await response.json();
          if (data.status === "success") {
            setposts(data.data);
            setMainImage(data.data.imageUrl?.[0]);
          }
        } catch (err) {
          console.error("Error fetching listing:", err);
        }
      };
      fetchListing();
    }
  }, [id, refresh]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const fetchMessages = () => {
    fetch(`http://localhost:9003/api/chat/messages/${posts?.sellerId}/${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setMessages(data.data);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };

  useEffect(() => {
    if (isChatOpen && posts) fetchMessages();
  }, [isChatOpen, posts, refresh]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await fetch("http://localhost:9003/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.userId,
          receiverId: posts?.sellerId,
          text: message,
        }),
      });
      setMessage("");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        <CreateGroupPage getgroups={() => {}} getRefresh={setRefresh} />
        <div className="container mx-auto px-4 py-8 mt-10">
          <div className="flex flex-wrap -mx-4">
            {/* Left Section - Images */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-auto rounded-lg shadow-md mb-4"
                />
              )}
              <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                {posts?.imageUrl?.slice(0, 4).map((thumb, index) => (
                  <img
                    key={index}
                    src={thumb}
                    alt={`Thumbnail ${index}`}
                    onClick={() => setMainImage(thumb)}
                    className={`size-16 sm:size-20 object-cover rounded-md cursor-pointer transition duration-300 ${
                      mainImage === thumb
                        ? "opacity-100 border-2 border-blue-500"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Section - Info */}
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-3xl font-bold mb-2">{posts?.title}</h2>
              <p className="text-gray-600 mb-4">SKU: WH1000XM4</p>

              <div className="mb-4">
                <span className="text-2xl font-bold mr-2">${posts?.price}</span>
              </div>

              <p className="text-gray-700 mb-6">{posts?.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  {showPhoneNumber ? <EyeOff /> : <Eye />}
                </button>
                {showPhoneNumber && (
                  <p className="text-gray-700 ml-2">{posts?.PhoneNumber}</p>
                )}

                <button
                  onClick={toggleChat}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  <MessageCircleMore />
                </button>
              </div>

              {/* Chat Box */}
              {isChatOpen && (
                <div className="fixed bottom-6 right-6 w-full sm:w-80 md:w-96 h-96 bg-white shadow-lg rounded-lg p-4 z-50">
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h2 className="text-lg font-semibold">Chat</h2>
                      <button
                        onClick={toggleChat}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {messages.length === 0 && (
                        <p className="text-gray-500 text-sm">No messages yet.</p>
                      )}
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`p-2 rounded-lg max-w-[80%] ${
                            msg.senderId === user._id
                              ? "bg-blue-100 ml-auto text-right"
                              : "bg-gray-200"
                          }`}
                        >
                          {msg.text}
                          <div className="text-[10px] text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center space-x-2 pt-2 border-t">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border p-2 rounded-lg"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Send
                      </button>
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

export default Details;
