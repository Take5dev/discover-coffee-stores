/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com'],
    minimumCacheTTL: 60,
  },

}

module.exports = nextConfig
