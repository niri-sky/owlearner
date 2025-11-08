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
    ],
  },
};

module.exports = nextConfig;
