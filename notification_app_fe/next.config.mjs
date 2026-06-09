/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow rendering components without hydration warnings if MUI dark mode has slight mismatches
  compiler: {
    styledComponents: true,
  }
};

export default nextConfig;
