import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG placeholders during development; swap for real images in production
    dangerouslyAllowSVG: true,
    // Removed the overly-restrictive CSP/sandbox that was blocking SVG gradients
    // and inline styles from rendering via next/image
    remotePatterns: [
      // Cloudinary — used for member profile images uploaded via the backend
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Allow any HTTPS image source as a fallback (useful for dev/staging APIs)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "https://friends-goal-a86e.vercel.app/api/v1";
    const backendOrigin = apiBase.replace(/\/api\/v1\/?$/, "");
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
