'use client';
import { Flex } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';

export default function Watch() {
  const videoSrc = useSearchParams().get('v');
  const videoPrefix =
    'https://storage.googleapis.com/vidspark-processed-videos/';

  return (
    <Flex align="center" justify="center">
      <video controls src={videoPrefix + videoSrc} />
    </Flex>
  );
}
