import { Storage } from '@google-cloud/storage';
import Ffmpeg from 'fluent-ffmpeg';
import { deleteFile, ensureDirectoryExists } from './file-system';

const storage = new Storage();

const rawVideoBucketName = 'vidspark-raw-videos';
const processedVideoBucketName = 'vidspark-processed-videos';

const localRawVideoPath = './raw-videos';
const localProcessedVideoPath = './processed-videos';

/**
 * Set up the directories for storing raw and processed videos.
 */
export function setupDirectories() { 
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);
}

/**
 * 
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName  - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video is processed.
 */
export function processVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    Ffmpeg()
      .input(`${localRawVideoPath}/${rawVideoName}`)
      .outputOption('-vf', 'scale=-1:360')
      .on('end', () => {
        console.log('Processing finished successfully');
        resolve();
      })
      .on('error', (err) => {
        console.log(`An error occured during video processing: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param rawVideoName - The name of the raw video file to download.
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the video is downloaded.
 */
export async function downloadRawVideo(rawVideoName: string) {
  const downloadedRawVideoFile = await storage.bucket(rawVideoBucketName)
    .file(rawVideoName)
    .download({ destination: `${localRawVideoPath}/${rawVideoName}` });

  console.log(`gs://${rawVideoBucketName}/${rawVideoName} downloaded to ${localRawVideoPath}/${rawVideoName}`);
}

/**
 * @param processedVideoName - The name of the processed video file to upload.
 * {@link localProcessedVideoPath} folder from the {@link processedVideoBucketName} bucket.
 * @returns A promise that resolves when the video is uploaded.
 */
export async function uploadProcessedVideo(processedVideoName: string) {
  const bucket = storage.bucket(processedVideoBucketName);
  await bucket.upload(`${localProcessedVideoPath}/${processedVideoName}`, {
    destination: processedVideoName,
  });

  console.log(`File ${processedVideoName} uploaded to gs://${processedVideoBucketName}/${processedVideoName}`)

  // Required to allow all users of the platform to view the video
  await bucket.file(processedVideoName).makePublic();
}

/**
 * @param processedVideoName - The name of processed video file to delete from the {@link processedVideoBucketName} folder.
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteLocalProcessedVideo(processedVideoName: string) {
  return deleteFile(`${localProcessedVideoPath}/${processedVideoName}`);
}

/**
 * @param rawVideoName  - The name of the raw video file to delete from the {@link localRawVideoPath} folder.
 * @returns A promise that resolves wheb the file has been deleted.
 */
export function deleteLocalRawVideo(rawVideoName: string) {
  return deleteFile(`${localRawVideoPath}/${rawVideoName}`);
}

export function cleanupLocalFiles(inputFileName: string, outputFileName: string) {
  return Promise.all([
    deleteLocalRawVideo(inputFileName),
    deleteLocalProcessedVideo(outputFileName),
  ]);
}