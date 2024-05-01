import {Storage} from "@google-cloud/storage";
import {deleteFile, ensureDirectoryExists} from "@helpers/file-system";
import {
  processedVideoBucketName,
  rawVideoBucketName,
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
 * @param {string} processedVideoName
 * The name of the processed video file to upload.
 * {@link localProcessedVideoPath} folder
 * from the {@link processedVideoBucketName} bucket.
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
export function cleanupLocalFiles(
  inputFileName: string,
  outputFileName: string
) {
  return Promise.all([
    deleteLocalRawVideo(inputFileName),
    deleteLocalProcessedVideo(outputFileName),
  ]);
}
