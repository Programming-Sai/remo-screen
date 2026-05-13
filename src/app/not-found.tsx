import { Header } from "@/components/ui/Header/Header";
import NotFoundState from "@/components/ui/NotFoundState/NotFoundState";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.code}>404</div>
        <div className={styles.copy}>
          <p className={styles.kicker}>Route unavailable</p>
          <h1 className={styles.title}>We can&apos;t find that page.</h1>
          <p className={styles.description}>
            The link may be outdated, mistyped, or pointing to a page that no
            longer exists.
          </p>
        </div>
      </section>

      <div className={styles.content}>
        <NotFoundState
          eyebrow="Page not found"
          icon="search_off"
          title="This route does not exist"
          description="Use the recruiter workspace below to get back to a place that exists."
          bullets={[
            "Check the URL for a typo or stale bookmark.",
            "Head back to the jobs page to continue working.",
          ]}
          primaryAction={{
            label: "Go to Jobs",
            href: "/jobs",
            icon: "work",
          }}
        />
      </div>
    </main>
  );
}
