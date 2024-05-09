/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VIDEOS_THUMBNAILS_BUCKET_URL:
      'https://storage.googleapis.com/vidspark-videos-thumbnails/',
    VIDEOS_BUCKET_URL:
      'https://storage.googleapis.com/vidspark-processed-videos/',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '**',
      },
      // TODO: Remove this before deployment.
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
