import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  // async redirects() {
  //   return [
  //     {
  //       source: '/', // Root path
  //       destination: '/auth', // Redirect to /home
  //       permanent: false, // Use temporary redirect (status code 307)
  //     },
  //   ];
  // },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.omise.co;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all domains (use cautiously in production)
      },
    ],
  },
};


export default nextConfig;
