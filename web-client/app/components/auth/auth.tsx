"use client";

import { Button } from '@radix-ui/themes';
import styles from './auth.module.css';
import { FaGoogle, FaSignOutAlt } from 'react-icons/fa';
import { signInWithGoogle, signOut } from '@/app/utilities/firebase/firebase';
import { User } from 'firebase/auth';

interface AuthProps {
  user: User | null
}

export default function Auth({ user }: AuthProps) {
  return (
    <div className={styles.buttonContainer}>
      {
        user ? (
          <Button size="3" color='cyan' variant="soft" onClick={signOut}>
            <FaSignOutAlt />
            Sign out
          </Button>
        ) : (
          <Button size="3" color='cyan' variant="soft" onClick={signInWithGoogle}>
            <FaGoogle />
            Sign in
          </Button>
        )
      }
    </div>
  )
}