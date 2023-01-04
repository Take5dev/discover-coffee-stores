/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    minimumCacheTTL: 60,
  },

}

module.exports = nextConfig
