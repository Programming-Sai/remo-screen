"use client";

import styles from "@/app/screening/[jobId]/page.module.css";

interface ScreeningWelcomeStepProps {
  jobTitle: string;
  questionCount: number;
  candidateName: string;
  candidateEmail: string;
  onCandidateNameChange: (value: string) => void;
  onCandidateEmailChange: (value: string) => void;
  onStart: () => void;
}

export default function ScreeningWelcomeStep({
  jobTitle,
  questionCount,
  candidateName,
  candidateEmail,
  onCandidateNameChange,
  onCandidateEmailChange,
  onStart,
}: ScreeningWelcomeStepProps) {
  return (
    <div className={styles.content}>
      <div className={styles.hero}>
        <div className={styles.heroOverlay}>
          <span className={styles.heroBadge}>Official Assessment</span>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.cardAccent} />
        <div className={styles.cardBody}>
          <header>
            <h1 className={styles.sectionTitle}>
              Welcome to your screening for {jobTitle}
            </h1>
            <p className={styles.sectionSubtext}>
              Please provide your details below to begin the assessment.
            </p>
          </header>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              onStart();
            }}
          >
            <div className={styles.field}>
              <label className={styles.label} htmlFor="full_name">
                Full Name <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <input
                id="full_name"
                className={styles.input}
                type="text"
                placeholder="Jane Doe"
                value={candidateName}
                onChange={(e) => onCandidateNameChange(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email Address <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="jane@example.com"
                value={candidateEmail}
                onChange={(e) => onCandidateEmailChange(e.target.value)}
                required
              />
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>⏱</div>
              <div>
                <div className={styles.infoTitle}>Estimated Duration</div>
                <div className={styles.infoText}>
                  {Math.max(5, questionCount * 5)} minutes • {questionCount}{" "}
                  sections
                </div>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button className={styles.secondaryButton} type="reset">
                Clear form
              </button>

              <button className={styles.primaryButton} type="submit">
                Start Screening
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🔒</div>
          <div>
            <div className={styles.infoTitle}>Privacy First</div>
            <div className={styles.infoText}>
              Your data is only visible to the hiring team.
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🛟</div>
          <div>
            <div className={styles.infoTitle}>Need Help?</div>
            <div className={styles.infoText}>
              Support is available throughout the test.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
