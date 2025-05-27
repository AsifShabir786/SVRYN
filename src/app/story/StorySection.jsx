import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusIcon, Cross1Icon, HeartIcon, ChatBubbleIcon, Share2Icon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';

const StorySection = () => {
  const [stories, setStories] = useState([]);
  console.log(stories,'userData________stories')
  const [modalOpen, setModalOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedUserStory, setSelectedUserStory] = useState(null);
const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
const [showComments, setShowComments] = useState(false);
  console.log(selectedUserStory?.stories,'userData________selectedUserStory')

  const [selectedStory, setSelectedStory] = useState(null);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const user = JSON.parse(localStorage.getItem("user-storage") || '{}');
  const userId = user?.state?.user?._id;
  const heartId = user?.state?.user?._id;
  const firstName = user?.state?.user?.firstName;
  const profilePicture = user?.state?.user?.profilePicture;

// console.log(named,'named______')

const handleLikeStory = async (storyId) => {
  // const heartId = user?.state?.user?._id;

  try {
    const response = await fetch(`https://fb-backend.vercel.app/Story/api/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        heartId: heartId
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('Liked successfully:', data.story);
      // optionally update UI
    } else {
      console.log('Info:', data.message);
    }
  } catch (error) {
    console.error('Error liking story:', error);
  }
};

  useEffect(() => {
    fetchStories();
  }, []);
// https://fb-backend.vercel.app
  const fetchStories = async () => {
    try {
      const res = await axios.get('https://fb-backend.vercel.app/Story/api/stories');
      console.log('API Response:', res.data);

      if (Array.isArray(res.data)) {
        // const userData = res.data.find(item => item.user?.name === 'chwdryhamza');
        // if (userData && userData.stories) {
          // setStories(res.data.stories);
          console.log(res.data,'userData________')
        setStories(res.data);

        // } else {
        //   console.error('User chwdryhamza not found in response:', res.data);
        //   setStories([]);
        // }
      } else if (res.data && res.data.stories) {
        setStories(res.data);
      } else {
        console.error('No stories found in response:', res.data);
        setStories([]);
      }
    } catch (err) {
      console.error('Failed to fetch stories:', err.message);
      setStories([]);
    }
  };

  const handleStoryUpload = async () => {
    if (!file && !text) return alert('Please provide a media file or text');
    if (!userId) return alert('User ID is required');

    const formData = new FormData();
    if (file) formData.append('media', file);
    formData.append('userId', userId);
    formData.append('text', text);

    try {
      await axios.post('https://fb-backend.vercel.app/Story/api/stories', formData);
      alert('Story uploaded!');
      fetchStories();
      setModalOpen(false);
      setFile(null);
      setText('');
    } catch (err) {
      console.error('Upload failed:', err.message);
    }
  };


const openStoryViewer = (userStory) => {
  setSelectedUserStory(userStory);
  setCurrentStoryIndex(0); // start from first story
  setViewerModalOpen(true);
};

const closeStoryViewer = () => {
  setViewerModalOpen(false);
  setSelectedUserStory(null);
  setCurrentStoryIndex(0);
};

const addComment = async (storyId) => {
  if (newComment.trim() && userId) {
    try {
      const response = await fetch(`https://fb-backend.vercel.app/Story/api/stories/${storyId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          text: newComment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments(prev => [...prev, {
          ...data.comment,
          user:firstName, // Replace with actual user name if needed
          profilePic:profilePicture,
        }]);
        setNewComment('');
      } else {
        console.error('Failed to add comment:', data.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }
};

  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg shadow-md">
      {/* Stories Thumbnails */}
      <div className="flex space-x-6 overflow-x-auto">
        <div
          onClick={() => setModalOpen(true)}
          className="min-w-[120px] flex flex-col items-center bg-white rounded-2xl border border-blue-200 p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
            <PlusIcon className="w-10 h-10 text-blue-600" />
          </div>
          <span className="mt-3 text-sm font-semibold text-gray-800 text-center">Create Story</span>
        </div>

     {stories?.map((userStory, idx) => (
  <div
    key={idx}
    onClick={() => openStoryViewer(userStory)}
    className="min-w-[120px] flex flex-col items-center bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
  >
    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden shadow-inner">
      <img
        src={userStory.stories[0]?.mediaUrl}
        alt={`Story ${idx + 1}`}
        className="w-full h-full object-cover"
      />
    </div>
    <span className="mt-3 text-sm font-semibold text-gray-800 text-center truncate">
      {userStory.user?.name}
    </span>
  </div>
))}

      </div>

      {/* Modal for Creating Story */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Story</h2>
            <textarea
              placeholder="Say something..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*,video/*"
              className="mb-4 text-gray-600"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && <p className="text-sm text-green-600 mb-4">Media selected: {file.name}</p>}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setFile(null);
                  setText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStoryUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Viewing Story */}
    {viewerModalOpen && selectedUserStory && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex">
      {/* Left Navigation */}
   

      {/* Main Media Content */}
      <div className="relative w-2/3 h-full bg-gray-100">
        <img
          src={selectedUserStory?.stories[currentStoryIndex]?.mediaUrl}
          alt="story"
          className="w-full h-full object-cover rounded-l-xl"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
          <img
            src={selectedUserStory.user.profilePicture}
            alt={selectedUserStory.user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{selectedUserStory.user.name}</span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-4">
          <button className="p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all">
            <ChevronUpIcon 
          onClick={() => setCurrentStoryIndex((prev) => prev - 1)}
             className="w-5 h-5 text-gray-600" />
          </button>
 <div className="d-flex align-items-center">
  <button
    className="btn btn-light rounded-circle shadow-sm"
    onClick={() => {
      const firstStoryId = selectedUserStory?.stories?.[0]?._id;
      if (firstStoryId) {
        handleLikeStory(firstStoryId);
        console.log(selectedUserStory?.stories?.[0], 'likedStory');
      }
    }}
  >
    ❤️
  </button>

  <span className="badge bg-primary ms-2">
    {selectedUserStory?.stories?.length ?? 0} 
  </span>
</div>


<button
  className="p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all"
  onClick={() => setShowComments(prev => !prev)} // toggle on click
>
  <ChatBubbleIcon className="w-5 h-5 text-gray-600" />
</button>

          <button className="p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all">
            <Share2Icon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all">
            <ChevronDownIcon 
          onClick={() => setCurrentStoryIndex((prev) => prev + 1)}
            className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

 {showComments && (
  <div className="w-1/3 p-4 bg-gray-50 flex flex-col">
    <div className="flex-1 overflow-y-auto">
      <h3 className="text-base font-semibold mb-3 text-gray-800">
        Comments (
          {
            selectedUserStory?.stories?.reduce(
              (acc, story) => acc + (story.comments?.length || 0),
              0
            )
          }
        )
      </h3>

      {selectedUserStory?.stories?.some((story) => story.comments?.length > 0) ? (
        selectedUserStory?.stories?.map((story) =>
          story.comments?.map((comment) => (
            <div key={comment._id} className="flex items-start mb-3">
              <img
                src={comment.user?.profilePicture}
                alt={comment.user?.username}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {comment.user?.username}
                </p>
                <p className="text-sm text-gray-600">
                  {comment.text}{' '}
                  <span className="text-xs text-gray-400 ml-1">
                    {new Date(comment.time).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 cursor-pointer hover:underline">
                    Like
                  </span>
                  <span className="text-xs text-gray-500 ml-2 cursor-pointer hover:underline">
                    Reply
                  </span>
                </p>
              </div>
            </div>
          ))
        )
      ) : (
        <p className="text-sm text-gray-400">No comments yet.</p>
      )}
    </div>

    {/* Add Comment */}
    <div className="mt-4">
      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
        <input
          type="text"
          placeholder="Add Comment..."
          className="flex-1 text-sm text-gray-600 outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      {selectedUserStory?.stories?.slice(0, 1).map((story) => (
  <div key={story._id} className="ml-2">
    <button
      onClick={() => {
        addComment(story._id);
        console.log(story._id, 'Clicked Story ID');
      }}
      className="text-gray-500 hover:text-blue-500"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z" />
      </svg>
    </button>
  </div>
))}

      </div>
    </div>
  </div>
)}


      {/* Close Button */}
      <button
        onClick={closeStoryViewer}
        className="absolute top-3 right-3 text-gray-600 bg-white rounded-full p-2 hover:bg-gray-100 shadow-sm"
      >
        <Cross1Icon className="w-5 h-5" />
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default StorySection;