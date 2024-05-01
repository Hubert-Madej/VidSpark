import ffmpeg from "fluent-ffmpeg";
import {
  localProcessedVideoPath,
  localRawVideoPath,
  localThumbnailPath,
} from "@constants/local-paths.constants";

/**
 * @param {string} rawVideoName
 * The name of the file to convert from {@link localRawVideoPath}.
 * @param {string} processedVideoName
 * The name of the file to convert to {@link localProcessedVideoPath}.
 * @return {Promise<void>}
 * A promise that resolves when the video is processed.
 */
export function processVideo(
  rawVideoName: string,
  processedVideoName: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(`${localRawVideoPath}/${rawVideoName}`)
      .outputOption("-vf", "scale=-1:360")
      .on("end", () => {
        console.log("Processing finished successfully");
        resolve();
      })
      .on("error", (err) => {
        console.error(`
        An error occured during video processing: ${err.message}`
        );
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param {string} videoFilePath
 * Local path of the video file to generate a thumbnail for.
 * @param {string} thumbnailName
 * Name of the thumbnail file to generate.
 * It will be saved in {@link localThumbnailPath}.
 * @return {Promise<void>}
 * A promise that resolves when the thumbnail is generated.
 */
export function generateThumbnailForVideo(
  videoFilePath: string,
  thumbnailName: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(videoFilePath)
      .outputOption("-vf", "thumbnail,scale=640:360")
      .output(`${localThumbnailPath}/${thumbnailName}`)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        console.error(`
        An error occured during thumbnail generation: ${err.message}`
        );
        reject(err);
      })
      .run();
  });
}
