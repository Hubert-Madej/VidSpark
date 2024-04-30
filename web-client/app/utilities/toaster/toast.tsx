import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import './toast.css';

interface ToasterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
  text?: string;
  duration?: number;
}

const Toaster: React.FC<ToasterProps> = ({ open, setOpen, children, text, duration = 5000 }) => {
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, duration);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [open, setOpen, duration]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">New Notification</Toast.Title>
        <Toast.Description className="ToastDescription" asChild>
          {children ? children : <div>{text}</div>}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default Toaster;