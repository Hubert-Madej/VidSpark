import Image from 'next/image';
import Link from 'next/link';

import { Video } from './interfaces/video.interface';
import styles from './page.module.css';
import { getVideos } from './utilities/firebase/functions';

export default async function Home() {
  const videos: Video[] = await getVideos();
  const videoThumbnailPrefix = process.env.VIDEOS_THUMBNAILS_BUCKET_URL;

  if (!videoThumbnailPrefix) {
    throw new Error(
      'The VIDEOS_THUMBNAILS_BUCKET_URL environment variable is not set.',
    );
  }

  return (
    <main className={styles.main}>
      {videos.map((video) => (
        <Link key={video.id} href={`/watch?v=${video.videoFileName}`}>
          <Image
            className={styles.thumbnail}
            src={videoThumbnailPrefix + video.thumbnailFileName}
            alt={video.thumbnailFileName!}
            width={300}
            height={150}
          />
          <h3 className={styles.title}>Title</h3>
          <div className={styles.stats}>
            <p className={styles.date}>02.05.2024</p>
            <p className={styles.views}>1,432,631 views</p>
          </div>
        </Link>
      ))}
    </main>
  );
}
