import {Request, Response} from "express";
import {isVideoNew, setVideo} from "@helpers/firestore";
import {VideoProcessingStatus} from "common";
import {
  generateThumbnailForVideo,
  processVideo,
} from "@helpers/video-processing";
import {StatusCodes} from "http-status-codes";
import {
  cleanupLocalThumbnail,
  cleanupLocalVideosFiles,
  downloadRawVideo,
  formatLocalProcessedVideoPath,
  uploadProcessedVideo,
  uploadThumbnail,
} from "@helpers/storage";
import {VideoMetadata} from "@dto/video-metadata.dto";

/**
 * Handler for the /process route.
 * @param {express.Request} req
 * Express request object.
 * @param {express.Response} res
 * Express response object.
 * @return {Promise<express.Response>}
 * Promise that resolves as Express response object.
 */
export default async function handleProcessingRoute(
  req: Request,
  res: Response
) {
  const data: VideoMetadata = req.body;

  const inputFileName = data.name;
  const outputFileName = `processed-${data.name}`;
  const videoId = inputFileName.split(".")[0];
  const processedVideoLocalPath =
  formatLocalProcessedVideoPath(outputFileName);
  const thumbnailFileName = `default-${videoId}.jpg`;

  const isNew = await isVideoNew(videoId);

  if (!isNew) {
    console.log(`Video ${videoId} processing already started.`);
    return res.status(400).send("Video processing already started.");
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split("-")[0],
      processingStatus: VideoProcessingStatus.PROCESSING,
      title: 'movie'

    });
  }

  // TODO: Move to dedicated function.
  try {
    await downloadRawVideo(inputFileName);
    await processLocalVideo(inputFileName, outputFileName);
    await uploadProcessedVideo(outputFileName);
  } catch (err) {
    console.error(`Error processing video: ${err}`);
    await setVideo(videoId, {
      processingStatus: VideoProcessingStatus.PENDING,
    });

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error: video processing failed.");
  }

  // TODO: Move to dedicated function.
  try {
    await generateThumbnailForVideo(
      processedVideoLocalPath,
      thumbnailFileName
    );
    await uploadThumbnail(thumbnailFileName);
  } catch (err) {
    console.error(`Error generating thumbnail: ${err}`);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error: video metadata generation.");
  }

  await setVideo(videoId, {
    processingStatus: VideoProcessingStatus.COMPLETED,
    videoFileName: outputFileName,
    thumbnailFileName: thumbnailFileName,
  });

  // Perfom cleanup after uploading the processed video.
  await Promise.all([
    cleanupLocalVideosFiles(inputFileName, outputFileName),
    cleanupLocalThumbnail(thumbnailFileName),
  ]);

  return res.status(StatusCodes.OK).send("Video processed successfully.");
}

/**
 * Handles the error that occured during video processing.
 * @param {string} inputFileName
 * @param {string} outputFileName
 * @param {unknown} err
 */
async function handleVideoProcessingError(
  inputFileName: string,
  outputFileName: string,
  err: unknown
) {
  console.error(`Error processing video: ${err}`);
  /* Clean up local files in case of processing failure.
  Promise.all allowed as it doesn't matter which file is deleted first. */
  await cleanupLocalVideosFiles(inputFileName, outputFileName);
}

/**
 * Processes the video file.
 * If an error occurs,
 * it is caught and handled by {@link handleVideoProcessingError}.
 * @param {string} inputFileName
 * @param {string} outputFileName
 */
async function processLocalVideo(
  inputFileName: string,
  outputFileName: string
) {
  try {
    await processVideo(inputFileName, outputFileName);
  } catch (err) {
    await handleVideoProcessingError(inputFileName, outputFileName, err);
    throw err;
  }
}
