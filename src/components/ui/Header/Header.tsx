import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";

export const Header = () => {
  return (
    <nav className={styles.topNav}>
      <div className={styles.brandBlock}>
        <div className={styles.brandMark}>RS</div>
        <div>
          <p className={styles.brandName}>Remo Screen</p>
          <p className={styles.brandSub}>Recruiter workspace</p>
        </div>
      </div>

      <div className={styles.navLinks}>
        <Link className={styles.navLinkActive} href="/jobs">
          Jobs
        </Link>
        <a className={styles.navLink} href="#">
          Talent
        </a>
        <a className={styles.navLink} href="#">
          Analytics
        </a>
      </div>

      <div className={styles.navActions}>
        <button className={styles.iconButton} type="button">
          Notifications
        </button>
        <button className={styles.iconButton} type="button">
          Settings
        </button>
        <div className={styles.avatar}>R</div>
      </div>
    </nav>
  );
};
