import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      // {
      //   source: "/dashboard",
      //   destination: "/dashboard/overview",
      //   permanent: true,
      // },
      // {
      //   source: "/dashboard/:path*",
      //   destination: "/dashboard/:path*",
      //   permanent: false,
      // },
    ];
  }
};

export default nextConfig;
