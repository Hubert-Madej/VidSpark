'use client';

import { onAuthStateChangedHelper } from '@/app/utilities/firebase/firebase';
import { Flex } from '@radix-ui/themes';
import { User } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './navbar.module.css';
import Auth from '../auth/auth';
import UploadDialog from '../upload-dialog/upload-dialog';
import Image from 'next/image';

export default function Navbar() {
  // Initialize the user state.
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => setUser(user));

    // Cleanup on component destruction to avoid memory leaks.
    return () => unsubscribe();
  }, []);

  return (
    <nav className={styles.nav}>
      <Flex gap="4" justify="between" align="center" width="100%">
        <Link href="/">
          <span className={styles.header}>
            <span className={styles['header-pre']}>Vid</span>Spark
          </span>
        </Link>
        <Flex align="center" gap="3">
          <UploadDialog user={user} />
          <Auth user={user} />
          {user && (
            <Image className={styles.avatar} src={user.photoURL!} alt='User Profile Image' width={32} height={32}></Image>
          )}
        </Flex>
      </Flex>
    </nav>
  );
}
