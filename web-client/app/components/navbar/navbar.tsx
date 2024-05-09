'use client';

import { onAuthStateChangedHelper } from '@/app/utilities/firebase/firebase';
import { Flex } from '@radix-ui/themes';
import { User } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './navbar.module.css';
import Auth from '../auth/auth';
import UploadDialog from '../upload-dialog/upload-dialog';
import UserInfo from '../user-info/user-info';
import { RxHamburgerMenu } from 'react-icons/rx';

export default function Navbar() {
  // Initialize the user state.
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => setUser(user));

    // Cleanup on component destruction to avoid memory leaks.
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const MenuItems = () => (
    <Flex align="center" gap="3">
      <UploadDialog user={user} />
      <Auth user={user} />
      <UserInfo user={user} />
    </Flex>
  );

  return (
    <nav className={styles.nav}>
      <Flex gap="4" justify="between" align="center" width="100%">
        <Link href="/">
          <span className={styles.header}>
            <span className={styles['header-pre']}>Vid</span>Spark
          </span>
        </Link>

        <button onClick={toggleMenu} className={styles.hamburger}>
          <RxHamburgerMenu />
        </button>

        <div className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
          <Flex direction="column" gap="4">
            <MenuItems />
          </Flex>
        </div>

        <div className={styles.desktopMenu}>
          <MenuItems />
        </div>
      </Flex>
    </nav>
  );
}
