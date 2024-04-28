import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <span className={styles.header}>
          <span className={styles['header-pre']}>Vid</span>Spark
        </span>
      </Link>
    </nav>
  );
}
