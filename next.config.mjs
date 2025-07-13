import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "encrypted-tbn0.gstatic.com",
      "ui-avatars.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "cdn.pixabay.com",
      "thumbs.dreamstime.com",
      "fb-backend.vercel.app",
      "images.unsplash.com"
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
