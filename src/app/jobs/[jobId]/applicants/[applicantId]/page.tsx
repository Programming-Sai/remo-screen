"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { jobs } from "@/data/jobs";
import { getScreeningByJobId, getSubmissionById } from "@/lib/storage";

import styles from "./page.module.css";
import Link from "next/link";

type AnalysisResult = {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendation: "advance" | "reject" | "hold";
};

export default function ApplicantPage() {
  const params = useParams();

  const jobId = params?.jobId as string;
  const applicantId = params?.applicantId as string;

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobId]);
  const screening = getScreeningByJobId(jobId);
  const submission = getSubmissionById(applicantId);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  if (!job) return <p>Job not found</p>;
  if (!submission) return <p>Applicant not found</p>;

  const questionMap = new Map(
    screening?.questions.map((question) => [question.id, question.text]) ?? [],
  );

  function analyze() {
    setLoading(true);

    setTimeout(() => {
      setAnalysis({
        summary:
          "Candidate shows solid communication, structured thinking, and a clear approach to problem solving.",
        strengths: [
          "Clear answers",
          "Good problem solving",
          "Consistent logic",
        ],
        concerns: ["Limited system design depth"],
        recommendation: "advance",
      });

      setLoading(false);
    }, 1200);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topNav}>
        <div className={styles.brandBlock}>
          <div className={styles.brandMark}>RS</div>
          <div>
            <p className={styles.brandName}>Remo Screen</p>
          </div>
        </div>

        <div className={styles.navLinks}>
          <Link className={styles.navLinkActive} href="/jobs">
            Jobs
          </Link>
          <Link className={styles.navLink} href="#">
            Talent
          </Link>
          <Link className={styles.navLink} href="#">
            Analytics
          </Link>
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
      </header>

      <main className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link href="/jobs">Jobs</Link>
          <span>›</span>
          <a href={`/jobs/${job.id}`}>{job.title}</a>
          <span>›</span>
          <span className={styles.breadcrumbCurrent}>Applicant</span>
        </div>

        <div className={styles.headerRow}>
          <div className={styles.applicantInfo}>
            <div className={styles.applicantAvatar}>
              {submission.candidateName
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </div>

            <div>
              <div className={styles.nameRow}>
                <h1 className={styles.title}>{submission.candidateName}</h1>
                <span className={styles.roleChip}>{job.title}</span>
              </div>

              <p className={styles.subText}>
                {submission.candidateEmail} • Applied{" "}
                {new Date(submission.submittedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            className={styles.analysisButton}
            onClick={analyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Response"}
          </button>
        </div>

        <div className={styles.layout}>
          <section className={styles.responsesColumn}>
            <h2 className={styles.sectionTitle}>Screening Responses</h2>

            <div className={styles.responseList}>
              {submission.answers.map((answer, index) => {
                const questionText =
                  questionMap.get(answer.questionId) ?? `Question ${index + 1}`;

                return (
                  <article
                    key={answer.questionId}
                    className={styles.responseCard}
                  >
                    <div className={styles.questionRow}>
                      <span className={styles.questionTag}>Q{index + 1}</span>
                      <p className={styles.questionText}>{questionText}</p>
                    </div>

                    <div className={styles.answerPanel}>
                      {answer.responseType === "audio" ? (
                        <>
                          <div className={styles.audioRow}>
                            <button
                              className={styles.audioButton}
                              type="button"
                            >
                              ▶
                            </button>

                            <div className={styles.audioTrack}>
                              <div className={styles.audioFill} />
                            </div>

                            <span className={styles.audioTime}>
                              0:45 / 2:12
                            </span>
                          </div>

                          <p className={styles.transcript}>
                            Transcript processing...
                          </p>
                        </>
                      ) : (
                        <p className={styles.textAnswer}>{answer.value}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className={styles.analysisColumn}>
            <div className={styles.analysisCard}>
              <div className={styles.analysisHeader}>
                <div className={styles.analysisHeading}>
                  <span className={styles.sparkIcon}>✦</span>
                  <h2>AI Insights</h2>
                </div>

                <span className={styles.modelChip}>GPT-4 Turbo</span>
              </div>

              {analysis ? (
                <div className={styles.analysisBody}>
                  <section className={styles.analysisSection}>
                    <h3 className={styles.analysisLabel}>Summary</h3>
                    <p className={styles.analysisText}>{analysis.summary}</p>
                  </section>

                  <section className={styles.analysisSection}>
                    <h3 className={styles.analysisLabel}>Key Strengths</h3>
                    <ul className={styles.checkList}>
                      {analysis.strengths.map((strength) => (
                        <li key={strength} className={styles.checkItem}>
                          <span className={styles.checkIcon}>✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.analysisSection}>
                    <h3 className={styles.analysisLabel}>Areas for Review</h3>
                    <div className={styles.reviewBox}>
                      <span className={styles.warningIcon}>!</span>
                      <p className={styles.reviewText}>
                        {analysis.concerns[0]}
                      </p>
                    </div>
                  </section>

                  <section className={styles.recommendationBlock}>
                    <div className={styles.recommendationRow}>
                      <span className={styles.analysisText}>
                        AI Recommendation
                      </span>
                      <span className={styles.recommendationChip}>
                        {analysis.recommendation === "advance"
                          ? "Highly Recommended"
                          : analysis.recommendation === "reject"
                            ? "Not Recommended"
                            : "Hold"}
                      </span>
                    </div>

                    <div className={styles.analysisActions}>
                      <button
                        className={styles.secondaryAnalysisButton}
                        type="button"
                      >
                        Skip
                      </button>
                      <button
                        className={styles.primaryAnalysisButton}
                        type="button"
                      >
                        Schedule Interview
                      </button>
                    </div>
                  </section>
                </div>
              ) : (
                <div className={styles.analysisPlaceholder}>
                  <p>Run analysis to generate recruiter guidance.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <nav className={styles.bottomNav}>
        <Link className={styles.bottomItem} href="/jobs">
          Jobs
        </Link>
        <a className={styles.bottomActive} href="#">
          Talent
        </a>
        <a className={styles.bottomItem} href="#">
          Analytics
        </a>
      </nav>
    </main>
  );
}
