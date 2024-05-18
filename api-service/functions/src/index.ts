import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {
  generateUploadUrlHandler,
  getVideoMetadataHandler,
  getVideosHandler,
} from "./handlers/videos/videos.handler";
import {createUserHandler} from "./handlers/users/users.handler";


initializeApp();
const fireStore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "vidspark-raw-videos";
const videoCollectionId = "videos";

// Video handler functions.
export const generateUploadUrl = generateUploadUrlHandler(
  storage,
  rawVideoBucketName
);
export const getVideos = getVideosHandler(fireStore, videoCollectionId);

export const getVideoMetadata = getVideoMetadataHandler(
  fireStore, videoCollectionId
);

// Users handler functions.
export const createUser = createUserHandler(fireStore);
