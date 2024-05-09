'use client';
import { Button, Flex } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import styles from './watch.module.css';
import { AiOutlineLike } from 'react-icons/ai';
import { AiOutlineDislike } from 'react-icons/ai';
import Image from 'next/image';
import { useState } from 'react';

export default function Watch() {
  const videoSrc = useSearchParams().get('v');
  const videoPrefix = process.env.VIDEOS_BUCKET_URL;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!videoPrefix) {
    throw new Error('The VIDEOS_BUCKET_URL environment variable is not set.');
  }

  return (
    <Flex
      direction="column"
      gap="8"
      className={styles.VideoContainer}
      align="center"
      justify="center"
    >
      <video
        className={styles.VideoPlayer}
        controls
        src={videoPrefix + videoSrc}
      />

      <div className={styles.MetaData}>
        <div className="flex flex-col gap-4 text-2xl font-extrabold">
          <h1>Chillstep Music for Programming / Cyber / Coding</h1>
          <div className="flex flex-row justify-between font-normal text-base">
            <div className="flex flex-row gap-2">
              <Image
                className="w-12 h-12 rounded-full"
                width={120}
                height={120}
                alt="test"
                src="https://yt3.ggpht.com/f_0nh3pN7GbYA1YwkuEQjX1_lRLD9ZUk3EjexYSPuOiqN298ScOcNVgGFU-AHZSmg1Yy4diG=s88-c-k-c0x00ffffff-no-rj"
              />
              <div>
                <p className="font-black">Chill Music Lab</p>
                <p className="text-sm">1.11M subscribers</p>
              </div>
              <div className="ml-6">
                <Button size="3" color="cyan" variant="soft">
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <button className={styles.VideoActionButton}>
                <AiOutlineLike />
              </button>
              <button className={styles.VideoActionButton}>
                <AiOutlineDislike />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.VideoDescription}>
          <div className="flex flex-row gap-2 font-bold mb-2">
            <p>11M views</p>
            <p>4 years ago</p>
          </div>
          <div
            className={`flex ${isExpanded ? 'items-left flex-col' : 'flex-row items-end'}`}
          >
            <p className={`${isExpanded ? '' : styles.Collapsed}`}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Cupiditate sapiente atque, neque commodi fuga ut nisi maiores
              totam porro omnis iste excepturi laudantium praesentium modi
              facere. Voluptatum molestias assumenda alias? Lorem ipsum dolor,
              sit amet consectetur adipisicing elit. Cupiditate sapiente atque,
              neque commodi fuga ut nisi maiores totam porro omnis iste
              excepturi laudantium praesentium modi facere. Voluptatum molestias
              assumenda alias? Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Cupiditate sapiente atque, neque commodi fuga ut
              nisi maiores totam porro omnis iste excepturi laudantium
              praesentium modi facere. Voluptatum molestias assumenda alias?
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Cupiditate sapiente atque, neque commodi fuga ut nisi maiores
              totam porro omnis iste excepturi laudantium praesentium modi
              facere. Voluptatum molestias assumenda alias? Lorem ipsum dolor,
              sit amet consectetur adipisicing elit. Cupiditate sapiente atque,
              neque commodi fuga ut nisi maiores totam porro omnis iste
              excepturi laudantium praesentium modi facere. Voluptatum molestias
              assumenda alias? Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Cupiditate sapiente atque, neque commodi fuga ut
              nisi maiores totam porro omnis iste excepturi laudantium
              praesentium modi facere. Voluptatum molestias assumenda alias?
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Cupiditate sapiente atque, neque commodi fuga ut nisi maiores
              totam porro omnis iste excepturi laudantium praesentium modi
              facere. Voluptatum molestias assumenda alias? Lorem ipsum dolor,
              sit amet consectetur adipisicing elit. Cupiditate sapiente atque,
              neque commodi fuga ut nisi maiores totam porro omnis iste
              excepturi laudantium praesentium modi facere. Voluptatum molestias
              assumenda alias? Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Cupiditate sapiente atque, neque commodi fuga ut
              nisi maiores totam porro omnis iste excepturi laudantium
              praesentium modi facere. Voluptatum molestias assumenda alias?
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Cupiditate sapiente atque, neque commodi fuga ut nisi maiores
              totam porro omnis iste excepturi laudantium praesentium modi
              facere. Voluptatum molestias assumenda alias? Lorem ipsum dolor,
              sit amet consectetur adipisicing elit. Cupiditate sapiente atque,
              neque commodi fuga ut nisi maiores totam porro omnis iste
              excepturi laudantium praesentium modi facere. Voluptatum molestias
              assumenda alias? Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Cupiditate sapiente atque, neque commodi fuga ut
              nisi maiores totam porro omnis iste excepturi laudantium
              praesentium modi facere. Voluptatum molestias assumenda alias?
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Cupiditate sapiente atque, neque commodi fuga ut nisi maiores
              totam porro omnis iste excepturi laudantium praesentium modi
              facere. Voluptatum molestias assumenda alias? Lorem ipsum dolor,
              sit amet consectetur adipisicing elit. Cupiditate sapiente atque,
              neque commodi fuga ut nisi maiores totam porro omnis iste
              excepturi laudantium praesentium modi facere. Voluptatum molestias
              assumenda alias? Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Cupiditate sapiente atque, neque commodi fuga ut
              nisi maiores totam porro omnis iste excepturi laudantium
              praesentium modi facere. Voluptatum molestias assumenda alias?
            </p>
            <button
              className="font-bold ml-0 text-left mt-2"
              onClick={toggleExpand}
            >
              {isExpanded ? 'Show less' : 'Show More'}
            </button>
          </div>
        </div>
      </div>
    </Flex>
  );
}
