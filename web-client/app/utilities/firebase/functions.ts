import { GenerateUploadUrlResponse } from "@/app/interfaces/generate-upload-url-response.interface";
import { getFunctions, httpsCallable } from "firebase/functions";

// Initialize the Firebase Functions client.
const functions = getFunctions();
const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");

/**
 * Uploads a video file to the bucket via signed URL.
 * @param file File to upload.
 * @returns The promise that resolves when the upload is complete.
 */
export async function uploadVideo(file: File) {
  const response = (await generateUploadUrl({
    fileExtension: file.name.split(".").pop(),
  })) as GenerateUploadUrlResponse;

  await fetch(response.data.url, {
    method: "PUT",
    body: file,
    headers: {
      'Content-Type': file.type,
    }
  });

  return;
}