import express from "express";
import dotenv from "dotenv";
import {StatusCodes} from "http-status-codes";
import {
  cleanupLocalFiles,
  downloadRawVideo,
  formatLocalProcessedVideoPath,
  setupDirectories,
  uploadProcessedVideo,
} from "@helpers/storage";
import {isVideoNew, setVideo} from "@helpers/firestore";
import {VideoProcessingStatus} from "@enums/video-processing-status.enum";
import {
  generateThumbnailForVideo,
  processVideo,
} from "@helpers/video-processing";
import {validateBody} from "@middlewares/validate-body.middleware";
import {VideoMetadata} from "@dto/video-metadata.dto";

dotenv.config();

const app = express();
app.use(express.json());
setupDirectories();

// @TODO: Refactor the code to split responsibilities into separate functions.
// @TODO: Verify edge-cases, check for possible errors.
// (Failed calls to db, what will happen in Pub/Sub)
app.post("/process", validateBody(VideoMetadata), async (req, res) => {
  let data: VideoMetadata;
  try {
    data = getRequestPayload(req);
  } catch (err) {
    console.error(`Error parsing Pub/Sub message: ${err}`);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send("Bad Request: missing name parameter.");
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${data.name}`;
  const videoId = inputFileName.split(".")[0];

  if (!(await isVideoNew(videoId))) {
    console.log(`Video ${videoId} processing already started.`);
    return res.status(400).send("Video processing already started.");
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split("-")[0],
      status: VideoProcessingStatus.PROCESSING,
    });
  }

  try {
    await downloadRawVideo(inputFileName);
    await processLocalVideo(inputFileName, outputFileName);
    await uploadProcessedVideo(outputFileName);

    const processedVideoLocalPath =
    formatLocalProcessedVideoPath(outputFileName);
    await generateThumbnailForVideo(
      processedVideoLocalPath,
      `thumbnail-${outputFileName}`
    );
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error: video processing failed.");
  }

  await setVideo(videoId, {
    status: VideoProcessingStatus.COMPLETED,
    filename: outputFileName,
  });

  // Perfom cleanup after uploading the processed video.
  await cleanupLocalFiles(inputFileName, outputFileName);

  return res.status(StatusCodes.OK).send("Video processed successfully.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Video Processing Service is listening at port :${port}`);
});

// @TODO: Add static typing for parsed payload.
/**
 *
 * @param {express.Request} req
 * The express request object.
 * @return {any}
 * JSON object parsed from the Pub/Sub message.
 */
function getRequestPayload(req: express.Request): VideoMetadata {
  const message = Buffer
    .from(req.body, "base64")
    .toString("utf-8");
  return JSON.parse(message);
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
  await cleanupLocalFiles(inputFileName, outputFileName);
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
