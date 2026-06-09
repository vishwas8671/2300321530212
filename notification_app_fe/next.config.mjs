import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow rendering components without hydration warnings if MUI dark mode has slight mismatches
  compiler: {
    styledComponents: true,
  },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
