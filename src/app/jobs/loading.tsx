import { Header } from "@/components/ui/Header/Header";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

import styles from "./page.module.css";

export default function Loading() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <Skeleton style={{ width: "42%", height: 18, marginBottom: 12 }} />
            <Skeleton style={{ width: "74%", height: 48, borderRadius: 12 }} />
            <Skeleton style={{ width: "92%", height: 20, marginTop: 16 }} />
          </div>
          <Skeleton style={{ width: 180, height: 44, borderRadius: 9999 }} />
        </header>

        <Skeleton style={{ width: "100%", height: 56, borderRadius: 16, marginBottom: 24 }} />

        <section className={styles.grid} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`${styles.card} ${styles.secondaryCard}`}>
              <Skeleton style={{ width: "36%", height: 24 }} />
              <Skeleton style={{ width: "72%", height: 30, borderRadius: 12 }} />
              <div className={styles.compactMeta}>
                <Skeleton style={{ width: "62%", height: 18 }} />
                <Skeleton style={{ width: "42%", height: 18 }} />
              </div>
              <div className={styles.secondaryFooter}>
                <Skeleton style={{ width: 40, height: 40 }} />
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
