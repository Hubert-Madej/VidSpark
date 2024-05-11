#!/bin/bash

# Authenticate with Google Cloud
gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS

# Set the project ID
gcloud config set project $GCP_PROJECT_ID

# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker

# Push the Docker image to Artifact Registry
docker push us-central1-docker.pkg.dev/$GCP_PROJECT_ID/video-processing-repo/video-processing-service

# Check if the Docker image upload was successful
if [ $? -eq 0 ]; then
    echo "Docker image upload was successful."
else
    echo "Docker image upload failed."
fi