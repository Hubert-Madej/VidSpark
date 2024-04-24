import fs from 'fs';

/**
 * Ensures that a directory exists.
 * @param directoryPath - The path of the directory to ensure exists.
 */
export function ensureDirectoryExists(directoryPath: string) {
  // Directory not exists, create one.
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Directory ${directoryPath} created.`);
  }
}

/**
 * Deletes a file from local storage.
 * @param filePath - The path of the file to delete.
 * @returns - A promise that resolves when the file has been deleted.
 */
export function deleteFile(filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`An error occurred while deleting the file:.`, err);
          reject(err);
        } else {
          console.log(`File ${filePath} deleted successfully.`);
          resolve();
        }
      });
    } else {
      console.log(`File ${filePath} does not exist. Skipping the delete.`)
      resolve();
    }
  });
}