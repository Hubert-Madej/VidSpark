#!/bin/bash

if [ -z "${GCP_PROJECT_ID}" ]; then
    echo "GCP_PROJECT_ID is not set. Exiting."
    exit 1
fi

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

gcloud run deploy vs-video-processing-service --image us-central1-docker.pkg.dev/$GCP_PROJECT_ID/video-processing-repo/video-processing-service \
  --region=us-central1 \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1 \
  --ingress=internal \
  --port 3000