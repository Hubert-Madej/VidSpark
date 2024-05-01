import Link from 'next/link';
import styles from './page.module.css';
import { getVideos } from './utilities/firebase/functions';
import { Video } from './interfaces/video.interface';

export default async function Home() {
  const videos: Video[] = await getVideos();

  return (
    <main className={styles.main}>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`}>
            <p>VIDEO THUMBNAIL</p>
          </Link>
        ))
      }
    </main>
  );
}
