# Stage 1: Build the app
FROM node:20.04 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production environment
FROM node:20.04

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /app

# Copy the package.json file
COPY package*.json ./

# Install only the production dependencies
RUN npm install --only=production

# Copy the source code
COPY --from=builder /app/dist ./dist

# Expose the port outside the container
EXPOSE 3000

# Start the application
CMD [ "npm", "run", "serve" ]