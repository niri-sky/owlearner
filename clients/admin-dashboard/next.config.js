/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: [
    //   "t4.ftcdn.net",
    //   "i.pravatar.cc",
    //   "modernize-angular-main.netlify.app",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
};

module.exports = nextConfig;
