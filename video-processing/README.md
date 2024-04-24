# VidSpark - Video Processing Service
This module is designed to manage video processing tasks for the VidSpark platform. It is built with Node.js and uses the Express framework to manage HTTP communication. For video processing operations, it relies on the FFmpeg command-line interface (CLI).

### Prerequisites:
  - Node v.20
  - Docker
  - Ffmpeg

### Commands
- Start Application: `npm start`
- Build Application: `npm run build`
- Serve Application: `npm run serve`
- Docker Build: `docker build -t vidspark-video-processing-service .`
- Run application in container: `docker run -p 3000:3000 -d vidspark-video-processing-service`