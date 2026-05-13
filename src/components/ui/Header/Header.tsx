import Image from "next/image";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <nav className={styles.topNav}>
      <div className={styles.brandBlock}>
        <div className={styles.brandMark}>
          <Image src="/logo.png" alt="Remo Screen logo" fill priority />
        </div>
        <div>
          <p className={styles.brandName}>Remo Screen</p>
          <p className={styles.brandSub}>Recruiter workspace</p>
        </div>
      </div>
    </nav>
  );
};
