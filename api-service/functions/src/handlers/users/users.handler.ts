import {Firestore} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";

/**
 * A handler to create a new user in firestore.
 * @param {Firestore} fireStore Firestore instance.
 * @return {void} User created successfully.
 */
export const createUserHandler = (fireStore: Firestore) => functions
  .auth
  .user()
  .onCreate((user) => {
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
