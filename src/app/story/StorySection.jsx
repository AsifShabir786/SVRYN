// Imports remain the same
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusIcon, Cross1Icon } from '@radix-ui/react-icons';

const StorySection = () => {
  const [stories, setStories] = useState([]);
  console.log(stories,'stories______-')
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserStories, setSelectedUserStories] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const user = JSON.parse(localStorage.getItem("user-storage") || '{}');
 console.log(user?.state?.user?._id, 'user_____1&7');
    const userId = user?.state?.user?._id
  // const [userId, setUserId] = useState('');
useEffect(() => {
  if (!modalOpen || !selectedUserStories) return;

  const interval = setInterval(() => {
    setCurrentStoryIndex((prevIndex) => {
      if (prevIndex < selectedUserStories.length - 1) {
        return prevIndex + 1;
      } else {
        clearInterval(interval);
        closeViewer();
        return prevIndex;
      }
    });
  }, 5000); // 5 seconds per story

  return () => clearInterval(interval);
}, [modalOpen, selectedUserStories, currentStoryIndex]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get('http://localhost:8080/Story/api/stories');
      setStories(res.data);
    } catch (err) {
      console.error('Failed to fetch stories', err);
    }
  };

  const openViewer = (userStories) => {
    setSelectedUserStories(userStories);
    setCurrentStoryIndex(0);
    setModalOpen(true);
  };

  const closeViewer = () => {
    setModalOpen(false);
    setSelectedUserStories(null);
    setCurrentStoryIndex(0);
  };

  const handleStoryUpload = async () => {
    if (!file && !text) return alert('Please provide a media file or text');
    if (!userId) return alert('User ID is required');

    const formData = new FormData();
    if (file) formData.append('media', file);
    formData.append('userId', userId);
    formData.append('text', text);

    try {
      await axios.post('http://localhost:8080/Story/api/stories', formData);
      alert('Story uploaded!');
      fetchStories();
      setFile(null);
      setText('');
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="p-4">
      {/* Stories Thumbnails */}
      <div className="flex space-x-4 overflow-x-auto no-scrollbar">
        {/* Add Story Card */}
        <div className="min-w-[100px] flex flex-col items-center bg-white rounded-xl shadow-md border p-3 cursor-pointer hover:bg-gray-50">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <PlusIcon className="w-6 h-6 text-gray-700" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-600">Add Story</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Existing Stories */}
        {stories.map(({ user, stories }, idx) => (
          <div
            key={idx}
            onClick={() => openViewer(stories)}
            className="min-w-[100px] flex flex-col items-center bg-white rounded-xl shadow-md border p-3 cursor-pointer hover:bg-gray-50"
          >
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
            />
            <span className="mt-2 text-sm text-gray-700 font-medium text-center truncate">{user.name}</span>
          </div>
        ))}
      </div>

      {/* Upload Inputs */}
      <div className="mt-4 space-y-2">
        {/* <input
          type="text"
          placeholder="Enter your user ID"
          className="p-2 border rounded-md w-full"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        /> */}
        <textarea
          placeholder="Say something..."
          className="p-2 border rounded-md w-full"
          rows="2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {file && <p className="text-sm text-green-600">Media selected: {file.name}</p>}
        <button
          onClick={handleStoryUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Story
        </button>
      </div>

   {modalOpen && selectedUserStories && (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    onClick={(e) => {
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - left;
      const isLeft = clickX < width / 2;

      if (isLeft) {
        setCurrentStoryIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        setCurrentStoryIndex((prev) =>
          prev < selectedUserStories.length - 1 ? prev + 1 : prev
        );
      }
    }}
  >
    <div className="relative w-full max-w-md h-[90%] bg-black rounded-lg overflow-hidden">
      <img
        src={selectedUserStories[currentStoryIndex].mediaUrl}
        alt="story"
        className="w-full h-full object-contain"
      />
      {selectedUserStories[currentStoryIndex].text && (
        <p className="absolute bottom-4 left-4 right-4 text-white text-lg bg-black bg-opacity-50 p-3 rounded-md">
          {selectedUserStories[currentStoryIndex].text}
        </p>
      )}

      {/* Progress Bars */}
      <div className="absolute top-0 left-0 w-full flex space-x-1 p-2">
        {selectedUserStories.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 ${
              i < currentStoryIndex
                ? 'bg-white'
                : i === currentStoryIndex
                ? 'bg-white animate-pulse'
                : 'bg-gray-500'
            } rounded-full`}
          />
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeViewer();
        }}
        className="absolute top-3 right-3 text-white text-xl bg-black bg-opacity-50 p-2 rounded-full"
      >
        <Cross1Icon />
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default StorySection;
