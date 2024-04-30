import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();
const fireStore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "vidspark-raw-videos";
const videoCollectionId = "videos";

/**
 * Function to create a new user in firestore.
 * @param user The user object.
 */
export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoURl: user.photoURL,
  };
  // Write new user data to firestore.
  fireStore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User created: ${JSON.stringify(userInfo)}`);
  return;
});

/**
 * Function to generate a signed URL for uploading a video.
 */
export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
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
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return {url, fileName};
});

// @TODO: Add pagination functionality.
/**
 * Function to retreive all videos from firestore.
 */
export const getVideos = onCall({maxInstances: 1}, async () => {
  const snapshot = await fireStore.collection(videoCollectionId).get();
  const videos = snapshot.docs.map((doc) => doc.data());

  return videos;
});
