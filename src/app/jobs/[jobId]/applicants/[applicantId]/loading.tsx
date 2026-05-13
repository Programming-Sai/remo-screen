import { Header } from "@/components/ui/Header/Header";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

import styles from "./page.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <Skeleton style={{ width: "24%", height: 18, marginBottom: 24 }} />

        <div className={styles.headerRow} aria-hidden="true">
          <div className={styles.applicantInfo}>
            <Skeleton style={{ width: 64, height: 64 }} />
            <div style={{ display: "grid", gap: 10, minWidth: 240, flex: 1 }}>
              <Skeleton style={{ width: "72%", height: 26 }} />
              <Skeleton style={{ width: "88%", height: 18 }} />
            </div>
          </div>
          <Skeleton style={{ width: 180, height: 44, borderRadius: 9999 }} />
        </div>

        <div className={styles.layout} aria-hidden="true">
          <section className={styles.responsesColumn}>
            <Skeleton style={{ width: "32%", height: 24, marginBottom: 20 }} />
            <div style={{ display: "grid", gap: 20 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} style={{ width: "100%", height: 180, borderRadius: 16 }} />
              ))}
            </div>
          </section>

          <aside className={styles.analysisColumn}>
            <Skeleton style={{ width: "100%", height: 420, borderRadius: 16 }} />
          </aside>
        </div>
      </main>
    </div>
  );
}
