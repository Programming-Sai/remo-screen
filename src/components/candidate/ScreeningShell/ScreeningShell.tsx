"use client";

import { ReactNode } from "react";

import styles from "@/app/screening/[jobId]/page.module.css";

interface ScreeningShellProps {
  children: ReactNode;
}

export default function ScreeningShell({ children }: ScreeningShellProps) {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>Screening Portal</div>

          <div className={styles.topActions}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Help"
            >
              ?
            </button>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Account"
            >
              ⦿
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerCopy}>
            © 2024 Screening Tool. Built for clarity.
          </span>

          <div className={styles.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
