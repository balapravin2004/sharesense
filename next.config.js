/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // disables in dev mode
});

module.exports = withPWA({
  reactStrictMode: false, // set to false or true as you like
});
