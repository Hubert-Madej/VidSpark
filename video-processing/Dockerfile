# Stage 1: Build environment
FROM node:20 as builder

# Set the working directory
WORKDIR /app

# Copy the common and video-processing directories
COPY common ./common
COPY video-processing ./video-processing

# Install dependencies and build the common module
WORKDIR /app/common
RUN npm install
RUN npm run build

# Install dependencies, create a symbolic link to the common module, and build the video-processing module
WORKDIR /app/video-processing
RUN npm install
RUN ln -s /app/common ./node_modules/common
RUN npm run build

# Stage 2: Production environment
FROM node:20-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg build-essential

# Set the working directory
WORKDIR /app

# Copy the common module and its dependencies
COPY --from=builder /app/common /app/common

# Copy the video-processing module and its dependencies
COPY --from=builder /app/video-processing /app/video-processing

# Install only the production dependencies for each module
WORKDIR /app/common
RUN npm install --only=production

WORKDIR /app/video-processing
RUN npm install --only=production

# Expose the port outside the container
EXPOSE 3000

# Start the application
CMD [ "npm", "run", "serve" ]