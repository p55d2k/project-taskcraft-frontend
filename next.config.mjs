/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    openaiKey: process.env.OPENAI_API_KEY, // pulls from .env file
  },
};

export default nextConfig;
