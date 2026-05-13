import { Header } from "@/components/ui/Header/Header";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

import styles from "./page.module.css";

export default function Loading() {
  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.content}>
        <Skeleton style={{ width: "22%", height: 18, marginBottom: 16 }} />

        <section className={styles.heroGrid} aria-hidden="true">
          <div className={styles.jobCard}>
            <Skeleton style={{ width: "48%", height: 18, marginBottom: 12 }} />
            <Skeleton style={{ width: "88%", height: 44, borderRadius: 12 }} />
            <Skeleton style={{ width: "72%", height: 18, marginTop: 18 }} />
          </div>
          <div className={styles.linkCard}>
            <Skeleton style={{ width: "55%", height: 20, marginBottom: 12 }} />
            <Skeleton style={{ width: "100%", height: 44, borderRadius: 12 }} />
            <Skeleton style={{ width: "100%", height: 44, borderRadius: 9999, marginTop: 12 }} />
          </div>
        </section>

        <section className={styles.pipelineCard} aria-hidden="true">
          <div className={styles.sectionHeader}>
            <Skeleton style={{ width: "28%", height: 24 }} />
            <Skeleton style={{ width: 240, height: 40, borderRadius: 9999 }} />
          </div>
          <div style={{ padding: 24, display: "grid", gap: 16 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} style={{ width: "100%", height: 72, borderRadius: 16 }} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
