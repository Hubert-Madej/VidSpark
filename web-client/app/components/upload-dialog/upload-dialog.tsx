import Toaster from '@/app/components/toaster/toast';
import { AuthProps } from '@/app/interfaces/auth-user.interface';
import { uploadVideo } from '@/app/utilities/firebase/functions';
import { Badge, Button, Dialog, Flex, Text } from '@radix-ui/themes';
import * as React from 'react';
import { FaUpload } from 'react-icons/fa';

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
              After processing you video it will be in{' '}
              <Badge color="orange">Draft</Badge> state. You can add all the
              details in &quot;Studio&quot; tab and publish it later.
            </Dialog.Description>

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
