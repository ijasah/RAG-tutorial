import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  assetPrefix: isProd ? '/RAG-tutorial/' : '',
  basePath: isProd ? '/RAG-tutorial' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.datacamp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bigdataanalyticsnews.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
