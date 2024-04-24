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
- Docker Build for GCP Deployment: `docker build -t <gcp-region>-docker.pkg.dev/<gcp-project-id>/<gcp-image-repo>/video-processing-service .`
- Run application in container: `docker run -p 3000:3000 -d vidspark-video-processing-service`

### Push Docker Image to GCP Repository
#### Prerequisites
  - GCP Account
  - GCP CLI
  - Docker

### Deployment Steps
 - You need to have a GCP CLI setup in place. For this refer to: [Google Cloud CLI](https://cloud.google.com/sdk/gcloud). Make sure that you are autenticated.
 - For your account, make sure that you have `artifactregistry.googleapis.com` enabled. You can do it with command:
 ```bash
 # Enable artifacts registry service in GCP.
 gcloud services enable artifactregistry.googleapis.com
 ```
 If you receive any errors, verify if you have a billing account assigned to the current project.
 - Update Google Cloud Components:
 ```bash
 # Update GCP componenets.
 gcloud components update
 ```
 - If not present, create repository for Docker artifacts (images):
 ```bash
 # Location, description and name can be adjusted to the needs. Repository format in case of this project must be kept as `docker`.
 gcloud artifacts repositories create video-processing-repo \
--repository-format=docker \
--location=us-central1 \
--description="Docker repo for video processing service"
 ```

If any error occurs, and running components update doesn't help, try to create repository via Web Console.

- Build Docker Image for deployment in with this command:
```bash
# For command template refer: `Commands` -> `Docker Build for GCP Deployment`.
docker build -t us-central1-docker.pkg.dev/<gcp-project-id>/video-processing-repo/video-processing-service .

# For M1 and above macs:
docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/<gcp-project-id>/video-processing-repo/video-processing-service .
```

- Configure GC CLI for images pushing:
```bash
# Region needs to match the one specified in the image name.
gcloud auth configure-docker us-central1-docker.pkg.dev
```

- Push image to repository:
```bash
docker push us-central1-docker.pkg.dev/<gcp-project-id>/video-processing-repo/video-processing-service
```

- Enable Cloud Run service:
```bash
gcloud services enable run.googleapis.com
```

- Create Cloud Run Service for running application:
  - Remember, this service should not be public, and should by only accessed by Pub / Sub, so we need to make sure to enable `Internal Ingress Control`, to allow only internal GCP Traffic (For simplicity, we will not require `Authentication` for this, which means all services within our VPC are allowed to invoke our new service.).
```bash
# Deploy container to Cloud Run
# Min Instance 0 - If we don't have data to process, we scale-down instances.
# Max Instance 1 - Only for dev/test purpose. Production environement should have more reliable scaling rules, to achive HA (High Availability) and FT (Fault Tolerance).
gcloud run deploy vs-video-processing-service --image us-central1-docker.pkg.dev/<gcp-project-id>/video-processing-repo/video-processing-service \
  --region=us-central1 \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1 \
  --ingress=internal \
  --port 3000

  # Allow unauthenticated invocations to [video-processing-service] (y/N)?  y - For sake of simplicty we allow all services within our VPC to invoke this service.
```
- Create Pub / Sub Topic for videos upload:
```bash
gcloud pubsub topics create videos-uploads-topic
```

- Create Subscription for Pub / Sub topic that will push videos to processing service:
```bash
gcloud pubsub subscriptions create projects/<gcp-project-id>/subscriptions/videos-uploads-cloud-run \
  --topic=projects/<gcp-project-id>/topics/videos-uploads-topic \
  --push-endpoint=https://vs-video-processing-service-lqq6ddpa7a-uc.a.run.app/process \
  --ack-deadline=600
```

- Create Bucket for raw videos:
```bash
gsutil mb -l us-central1 --pap=enforced gs://vidspark-raw-videos
```

- Create bucket for processed videos:
```bash
gsutil mb -l us-central1 gs://vidspark-processed-videos
```

- Send notification to Pub / Sub when new raw video is uploaded:
```bash
# If you ever delete this topic, and then create again - remember about removing existing notification and creating it again.
gsutil notification create -t videos-uploads-topic -f json OBJECT_FINALIZE gs://vidspark-raw-videos
``` 