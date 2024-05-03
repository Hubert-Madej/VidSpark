import express from "express";
import dotenv from "dotenv";
import {
  setupDirectories,
} from "@helpers/storage";
import {validateBody} from "@middlewares/validate-body.middleware";
import {VideoMetadata} from "@dto/video-metadata.dto";
import handleProcessingRoute from "@handlers/process.handler";

dotenv.config();

const app = express();
app.use(express.json());
setupDirectories();

// @TODO: Verify edge-cases, check for possible errors.
// (Failed calls to db, what will happen in Pub/Sub)
app.post("/process", validateBody(VideoMetadata), async (req, res) => {
  return handleProcessingRoute(req, res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Video Processing Service is listening at port :${port}`);
});
