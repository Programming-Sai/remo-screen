import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";

export const Header = () => {
  return (
    <nav className={styles.topNav}>
      <Link href="/" className={styles.brandBlock}>
        <div className={styles.brandMark}>
          <Image src="/logo.png" alt="Remo Screen logo" fill priority />
        </div>
        <div>
          <p className={styles.brandName}>Remo Screen</p>
          <p className={styles.brandSub}>Recruiter workspace</p>
        </div>
      </Link>
    </nav>
  );
};
