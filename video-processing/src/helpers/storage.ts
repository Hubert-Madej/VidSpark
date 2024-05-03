import {Storage} from "@google-cloud/storage";
import {deleteFile, ensureDirectoryExists} from "@helpers/file-system";
import {
  processedVideoBucketName,
  rawVideoBucketName,
  videosThumbnailsBucketName,
} from "@constants/buckets.constant";
import {
  localProcessedVideoPath,
  localRawVideoPath,
  localThumbnailPath,
} from "@constants/local-paths.constants";

const storage = new Storage();

/**
 * Set up the directories for storing raw and processed videos.
 */
export function setupDirectories() {
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);
  ensureDirectoryExists(localThumbnailPath);
}

/**
 * Downloads a raw video from the bucket to local storage.
 * @param {string} rawVideoName
 * The name of the raw video file to download.
 * {@link rawVideoBucketName}
 * bucket into the {@link localRawVideoPath} folder.
 * @return {Promise<void>}
 * A promise that resolves when the video is downloaded.
 */
export async function downloadRawVideo(rawVideoName: string) {
  await storage.bucket(rawVideoBucketName)
    .file(rawVideoName)
    .download({destination: `${localRawVideoPath}/${rawVideoName}`});

  console.log(
    `gs://${rawVideoBucketName}/${rawVideoName} 
    downloaded to ${localRawVideoPath}/${rawVideoName}`
  );
}

/**
 * Uploads a processed video from local storage to the bucket.
 * @param {string} processedVideoName
 * The name of the processed video file to upload from the
 * {@link localProcessedVideoPath} folder
 * to the {@link processedVideoBucketName} bucket.
 * @return {Promise<void>}
 * A promise that resolves when the video is uploaded.
 */
export async function uploadProcessedVideo(processedVideoName: string) {
  const bucket = storage.bucket(processedVideoBucketName);
  await bucket.upload(`${localProcessedVideoPath}/${processedVideoName}`, {
    destination: processedVideoName,
  });

  console.log(
    `File ${processedVideoName} uploaded to 
    gs://${processedVideoBucketName}/${processedVideoName}`
  );

  // Required to allow all users of the platform to view the video
  await bucket.file(processedVideoName).makePublic();
}

/**
 * Uploads a thumbnail from local storage to the bucket.
 * @param {string} thumbnailName
 * The name of the thumbnail file to upload from the
 * {@link localThumbnailPath} folder
 * to the {@link videosThumbnailsBucketName} bucket.
 */
export async function uploadThumbnail(thumbnailName: string) {
  const bucket = storage.bucket(videosThumbnailsBucketName);
  await bucket.upload(`${localThumbnailPath}/${thumbnailName}`, {
    destination: thumbnailName,
  });

  console.log(
    `File ${thumbnailName} uploaded to 
    gs://${videosThumbnailsBucketName}/${thumbnailName}`
  );

  await bucket.file(thumbnailName).makePublic();
}

/**
 * Deletes a processed video file from local storage.
 * @param {string} processedVideoName
 * The name of processed video file to delete
 * from the {@link processedVideoBucketName} folder.
 * @return {Promise<void>}
 * A promise that resolves when the file has been deleted.
 */
export function deleteLocalProcessedVideo(processedVideoName: string) {
  return deleteFile(`${localProcessedVideoPath}/${processedVideoName}`);
}

/**
 * Deletes a raw video file from local storage.
 * @param {string} rawVideoName
 * The name of the raw video file to delete
 * from the {@link localRawVideoPath} folder.
 * @return {Promise<void>}
 * A promise that resolves wheb the file has been deleted.
 */
export function deleteLocalRawVideo(rawVideoName: string) {
  return deleteFile(`${localRawVideoPath}/${rawVideoName}`);
}

/**
 * Formats the local path for requested processed video file name.
 * @param {string} processedVideoName
 * The name of the processed video file.
 * @return {string}
 * The local path for the processed video file.
 */
export function formatLocalProcessedVideoPath(
  processedVideoName: string
): string {
  return `${localProcessedVideoPath}/${processedVideoName}`;
}

/**
 * Perform cleanup of raw and processed video files.
 * @param {string} inputFileName
 * The name of the raw video file to delete
 * from the {@link localRawVideoPath} folder.
 * @param {string} outputFileName
 * The name of the processed video file to delete
 * from the {@link localProcessedVideoPath} folder.
 * @return {Promise<void>}
 * A promise that resolves when the files have been deleted.
 */
export function cleanupLocalVideosFiles(
  inputFileName: string,
  outputFileName: string
) {
  return Promise.all([
    deleteLocalRawVideo(inputFileName),
    deleteLocalProcessedVideo(outputFileName),
  ]);
}

/**
 * Perform cleanup of local thumbnail file.
 * @param {string} thumbnailFileName
 * The name of the thumbnail file to delete.
 * @return {Promise<void>}
 * A promise that resolves when the file has been deleted.
 */
export function cleanupLocalThumbnail(thumbnailFileName: string) {
  return deleteFile(`${localThumbnailPath}/${thumbnailFileName}`);
}
