import Toaster from '@/app/components/toaster/toast';
import { AuthProps } from '@/app/interfaces/auth-user.interface';
import { uploadVideo } from '@/app/utilities/firebase/functions';
import { Button, Dialog, Flex, Text, TextArea } from '@radix-ui/themes';
import * as React from 'react';
import { FaUpload } from 'react-icons/fa';
import styles from './upload-dialog.module.css';

const UploadDialog = ({ user }: AuthProps) => {
  const [toastOpen, setToastOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [fileToUpload, setFileToUpload] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      setFileToUpload(file);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) {
      return;
    }

    try {
      await uploadVideo(fileToUpload);
      setToastMessage('File uploaded successfully');
      setToastOpen(true);
    } catch (error) {
      setDialogOpen(false);
      setToastMessage('An error occurred while uploading the file');
      setToastOpen(true);
    }
  };

  return (
    user && (
      <>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger>
            <Button size="3" color="cyan" variant="soft">
              <FaUpload />
              Upload
            </Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Upload your new video</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Show the world another piece of your history!
            </Dialog.Description>

            <fieldset className={styles.Fieldset}>
              <label className={styles.Label} htmlFor="title">
                Title
              </label>
              <input className={styles.Input} id="title" />
            </fieldset>

            <fieldset className={styles.Fieldset}>
              <label className={styles.Label} htmlFor="description">
                Description
              </label>
              <textarea className={styles.TextArea} rows={8} id="description" />
            </fieldset>

            <Flex gapY="2" direction="column" gap="3">
              <Text as="div" size="4" mb="1" weight="bold">
                File to upload:
              </Text>
              <input onChange={handleFileChange} type="file" accept="video/*" />
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleUpload} color="cyan" variant="soft">
                Upload
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        <Toaster open={toastOpen} setOpen={setToastOpen} text={toastMessage} />
      </>
    )
  );
};

export default UploadDialog;
