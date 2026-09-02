/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "store.storeimages.cdn-apple.com",
        pathname: "/1/as-images.apple.com/is/**",
      },
      { protocol: "https", hostname: "cdn.salla.sa" },
      { protocol: "https", hostname: "cdn.idealo.com" },
      { protocol: "https", hostname: "mobileplanet.ua" },
      { protocol: "https", hostname: "www.proshop.fi" },
    ],
  },
};

module.exports = nextConfig;
