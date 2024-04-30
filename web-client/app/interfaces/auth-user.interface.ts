import { User } from "firebase/auth";

export interface AuthProps {
  user: User | null;
}