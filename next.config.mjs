/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "encrypted-tbn0.gstatic.com",
      "ui-avatars.com",
      "lh3.googleusercontent.com", // <-- ADD THIS LINE
      "avatars.githubusercontent.com", // <-- ADD THIS LINE
      "cdn.pixabay.com", // <-- ADD THIS LINE
      "thumbs.dreamstime.com", // <--- ADD THIS ONE
      "fb-backend.vercel.app", // <--- ADD THIS ONE IF YOUR POST IMAGES COME FROM HERE
    ],
  },
};

export default nextConfig;
