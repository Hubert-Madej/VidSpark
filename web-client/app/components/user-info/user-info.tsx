import { AuthProps } from '@/app/interfaces/auth-user.interface';
import * as Tooltip from '@radix-ui/react-tooltip';
import Image from 'next/image';
import styles from './user-info.module.css';

export default function UserInfo({ user }: AuthProps) {
  return (
    user && (
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={300}>
          <Tooltip.Trigger asChild>
            <Image
              className={styles.avatar}
              src={user.photoURL!}
              alt="User Profile Image"
              width={32}
              height={32}
            ></Image>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="TooltipContent"
              side="bottom"
              sideOffset={5}
            >
              {user.email}
              <Tooltip.Arrow className="TooltipArrow" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  );
}
