const nextConfig = {
  serverExternalPackages: ['@node-jhora/core', '@node-jhora/prediction', '@node-jhora/analytics'],
  // output: 'standalone',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  } as Record<string, unknown>,
  typescript: {
    ignoreBuildErrors: true,
  } as Record<string, unknown>,
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
