/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  reactStrictMode: true,
  images: { domains: ["picsum.photos"] },
  experimental: {
    outputStandalone: true,
  },
};

module.exports = nextConfig;
