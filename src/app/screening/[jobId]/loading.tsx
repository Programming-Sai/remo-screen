import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

import styles from "./page.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.content} aria-hidden="true">
          <Skeleton style={{ width: "100%", height: 190, borderRadius: 16, marginBottom: 24 }} />
          <Skeleton style={{ width: "60%", height: 28, marginBottom: 16 }} />
          <Skeleton style={{ width: "100%", height: 340, borderRadius: 16 }} />
        </div>
      </main>
    </div>
  );
}
