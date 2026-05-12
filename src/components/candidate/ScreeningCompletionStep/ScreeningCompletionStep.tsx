"use client";

import styles from "@/app/screening/[jobId]/page.module.css";

interface ScreeningCompletionStepProps {
  jobTitle: string;
  onReturnToDashboard: () => void;
}

export default function ScreeningCompletionStep({
  jobTitle,
  onReturnToDashboard,
}: ScreeningCompletionStepProps) {
  return (
    <div className={styles.content}>
      <section className={styles.completeCard}>
        <div className={styles.completeIconWrap}>
          <div className={styles.completeIcon}>✓</div>
        </div>

        <div className={styles.completeBody}>
          <h1 className={styles.completeTitle}>
            Thank you for completing your screening!
          </h1>

          <div className={styles.completeCopy}>
            <p className={styles.completeLead}>
              Your responses for the <strong>{jobTitle}</strong> role have been
              submitted successfully.
            </p>
            <p className={styles.completeBodyText}>
              The hiring team will review your application and get back to you
              soon via email.
            </p>
          </div>

          <div className={styles.completeDivider} />

          <div className={styles.completeActions}>
            <button
              className={styles.completeButton}
              type="button"
              onClick={onReturnToDashboard}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </section>

      <div className={styles.completeMetaGrid}>
        <div className={styles.metaCard}>
          <div className={styles.metaIcon}>⏰</div>
          <div>
            <div className={styles.metaTitle}>Estimated review time</div>
            <div className={styles.metaText}>3-5 business days</div>
          </div>
        </div>

        <div className={styles.metaCard}>
          <div className={styles.metaIcon}>✉</div>
          <div>
            <div className={styles.metaTitle}>Confirmation sent</div>
            <div className={styles.metaText}>Check your inbox for details</div>
          </div>
        </div>
      </div>
    </div>
  );
}
