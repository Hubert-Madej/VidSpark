import {Storage} from "@google-cloud/storage";
import {GenerateUploadUrlResponse, Video} from "common";
import {Firestore} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import {onCall} from "firebase-functions/v2/https";

/**
 * Generate a signed URL for uploading a video.
 * @param {Storage} storage Storage instance.
 * @param {string} rawVideoBucketName
 * Raw video bucket name.
 * @return {GenerateUploadUrlResponse}
 * URL for uploading a file and the file name.
 */
export const generateUploadUrlHandler =
(storage: Storage, rawVideoBucketName: string) => onCall({maxInstances: 1},
  async (request) => {
  // Check if user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Unauthenticated access to the function."
      );
    }
    const {auth, data} = request;
    const bucket = storage.bucket(rawVideoBucketName);
    // Generate a unique file name.
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes,
    });
    const response: GenerateUploadUrlResponse = {url, fileName};

    return response;
  });

/**
 * Function to get paginated videos from firestore.
 * @param {Firestore} fireStore Firestore instance.
 * @param {string} videosCollectionId Collection ID of videos.
 * @return {PaginatedResponse} List of paginated videos.
 */
export const getVideosHandler = (
  fireStore: Firestore,
  videosCollectionId: string
) =>
  onCall({maxInstances: 1}, async () => {
    const snapshot = await fireStore.collection(videosCollectionId).get();
    const videos = snapshot.docs.map((doc) => doc.data());

    return videos;
  });


/**
 * Function to get video metadata.
 * @param {Firestore} fireStore Firestore instance
 * @param {string} videosCollectionId
 * @return {Video} Video metadata.
 */
export const getVideoMetadataHandler = (
  fireStore: Firestore,
  videosCollectionId: string
) =>
  onCall({maxInstances: 1}, async (request) => {
    const videoId = request.data.videoId;
    const snapshot = await fireStore
      .collection(videosCollectionId)
      .doc(videoId)
      .get();
    const video = snapshot.data() as Video;

    return video;
  });
