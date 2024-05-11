#!/bin/bash

# Go to root directory.
cd ../

# Check if GCP_PROJECT_ID is set. Prompt user for input if not set.
if [ -z "$GCP_PROJECT_ID" ]; then
  echo "GCP_PROJECT_ID is not set. Please enter your GCP project ID:"
  read GCP_PROJECT_ID
  export GCP_PROJECT_ID
fi

# Build the video-processing Docker image.
# --platform linux/amd64 flag is used to build the image for the x86 architecture.
docker build --platform linux/amd64 -t gcr.io/$GCP_PROJECT_ID/video-processing -f video-processing/Dockerfile .