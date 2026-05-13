"use client";

import { ReactNode } from "react";

import styles from "@/app/screening/[jobId]/page.module.css";

interface ScreeningShellProps {
  children: ReactNode;
}

export default function ScreeningShell({ children }: ScreeningShellProps) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
