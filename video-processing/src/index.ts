import express from "express";
import {
  cleanupLocalFiles,
  downloadRawVideo,
  processVideo, setupDirectories,
  uploadProcessedVideo,
} from "./helpers/storage";
import dotenv from "dotenv";
import {isVideoNew, setVideo} from "./helpers/firestore";
import {VideoProcessingStatus} from "./enums/video-processing-status.enum";

dotenv.config();

const app = express();
app.use(express.json());
setupDirectories();

// @TODO: Refactor the code to split responsibilities into separate functions.
// @TODO: Verify edge-cases, check for possible errors.
// (Failed calls to db, what will happen in Pub/Sub)
app.post("/process", async (req, res) => {
  let data;
  try {
    const message = Buffer
      .from(req.body.message.data, "base64")
      .toString("utf-8");
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error("Invalid Payload received.");
    }
  } catch (err) {
    console.error(`Error parsing Pub/Sub message: ${err}`);
    return res.status(400).send("Bad Request: missing name parameter.");
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

  // Download the raw video from GCS.
  await downloadRawVideo(inputFileName);

  try {
    await processVideo(inputFileName, outputFileName);
  } catch (err) {
    console.error(`Error processing video: ${err}`);
    /* Clean up local files in case of processing failure.
    Promise.all allowed as it doesn't matter which file is deleted first. */
    await cleanupLocalFiles(inputFileName, outputFileName);

    return res
      .status(500)
      .send("Internal Server Error: video processing failed.");
  }

  // Upload the processed video to GCS.
  await uploadProcessedVideo(outputFileName);

  await setVideo(videoId, {
    status: VideoProcessingStatus.COMPLETED,
    filename: outputFileName,
  });

  // Perfom cleanup after uploading the processed video.
  await cleanupLocalFiles(inputFileName, outputFileName);

  return res.status(200).send("Video processed successfully.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Video Processing Service is listening at port :${port}`);
});
