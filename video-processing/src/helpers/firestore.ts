import {credential} from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Video} from "@interfaces/video.interface";
import {VideoProcessingStatus} from "@/enums/video-processing-status.enum";

initializeApp({credential: credential.applicationDefault()});
const firestore = new Firestore();
const videoCollectionId = "videos";

/**
 * Retrieves a video from Firestore.
 * @param {string} videoId
 * The ID of the video to retrieve.
 * @return {Promise<Video | undefined>}
 * A promise that resolves with the video metadata
 * or undefined if the video does not exist.
 */
async function getVideo(videoId: string) {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .get();

  return snapshot.exists ? (snapshot.data() as Video) : undefined;
}

/**
 * Sets the metadata of a video in Firestore.
 * @param {string} videoId
 * The ID of the video to update.
 * @param {string} video
 * The video metadata to update.
 * @return {Promise<FirebaseFirestore.WriteResult>}
 * A promise that resolves with the write result of the update operation.
 */
export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, {merge: true});
}

/**
 * Helper function to check if a video is new.
 * @param {string} videoId
 * @return {Promise<boolean>}
 */
export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  // If we didn't set the status yet, it indicates that the video is new.
  return video?.status === undefined ||
   video?.status === VideoProcessingStatus.PENDING;
}

