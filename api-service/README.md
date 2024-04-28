# VidSpark - API Service

## Background
This module serves as a general API for VidSpark Application. It is in charge of managing and serving user content that includes:
  - User Info
  - Videos and its metadata

API Service is backed up by Google Cloud Functions. GCP Functions allows us to run code in serverless architecture, and also to eaisly emulate this behavior locally thanks to the dedicated [Firebase Function Emulator](https://firebase.google.com/docs/functions/local-emulator).
