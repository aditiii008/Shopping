/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // simplest: allow Cloudinary
    domains: ["res.cloudinary.com"],
    // (optional) if you want to be explicit about formats, add: formats: ['image/avif', 'image/webp']
  },
};

module.exports = nextConfig;
