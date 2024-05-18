import { get } from 'http';

import { GenerateUploadUrlResponse } from '@/app/interfaces/generate-upload-url-response.interface';
import { Video } from 'common';
import { getFunctions, httpsCallable } from 'firebase/functions';

import { functions } from './firebase';

// Initialize the Firebase Functions client.
const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');
const getVideoMetadataFunction = httpsCallable(functions, 'getVideoMetadata');

/**
 * Uploads a video file to the bucket via signed URL.
 * @param file File to upload.
 * @returns The promise that resolves when the upload is complete.
 */
export async function uploadVideo(file: File) {
  const response = (await generateUploadUrl({
    fileExtension: file.name.split('.').pop(),
  })) as GenerateUploadUrlResponse;

  await fetch(response.data.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  return;
}

export async function getVideos() {
  const response = await getVideosFunction();
  return response.data as Video[];
}

export async function getVideoMetadata(videoId: string) {
  const response = await getVideoMetadataFunction({ videoId });
  return response.data as Video;
}
