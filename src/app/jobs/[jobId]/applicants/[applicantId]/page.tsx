"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { jobs } from "@/data/jobs";
import {
  getAnalysisBySubmissionId,
  getScreeningsByJob,
  getSubmissionById,
  saveAnalysis,
} from "@/lib/storage";
import { formatRelativeTime } from "@/lib/timeFormat";
import { AnalysisResult } from "@/types";

import styles from "./page.module.css";
import { Header } from "@/components/ui/Header/Header";
import { Icon } from "@/components/ui/Icon/Icon";
import AudioPlayer from "@/components/recruiter/AudioPlayer/AudioPlayer";
import NotFoundState from "@/components/ui/NotFoundState/NotFoundState";

export default function ApplicantPage() {
  const params = useParams();
  const jobId = params?.jobId as string;
  const applicantId = params?.applicantId as string;

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobId]);
  const screening = getScreeningsByJob(jobId)[0];
  const submission = getSubmissionById(applicantId);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(
    getAnalysisBySubmissionId(applicantId) ?? null,
  );

  if (!job) {
    return (
      <main className={styles.page}>
        <Header />

        <div className={styles.content}>
          <NotFoundState
            eyebrow="Missing job"
            icon="work_off"
            title="We could not find that job"
            description="The applicant link points to a job that no longer exists or was typed incorrectly."
            bullets={[
              "Return to the jobs page and open the correct job detail view.",
              "If this is unexpected, check that the job seed data still includes this ID.",
            ]}
            primaryAction={{
              label: "Back to Jobs",
              href: "/jobs",
              icon: "arrow_back",
            }}
          />
        </div>
      </main>
    );
  }

  if (!submission) {
    return (
      <main className={styles.page}>
        <Header />

        <div className={styles.content}>
          <NotFoundState
            eyebrow="Missing applicant"
            icon="person_off"
            title="This applicant submission was not found"
            description="The review link may be stale, or the candidate may not have submitted this screening yet."
            bullets={[
              "Return to the job detail page to review the applicant pipeline.",
              "If the candidate has not submitted yet, check back after they complete the screening.",
            ]}
            primaryAction={{
              label: "Back to Job",
              href: `/jobs/${job.id}`,
              icon: "arrow_back",
            }}
            secondaryAction={{
              label: "Back to Jobs",
              href: "/jobs",
              icon: "work",
              variant: "secondary",
            }}
          />
        </div>
      </main>
    );
  }

  const submissionId = submission.id;
  const questionMap = new Map(
    screening?.questions.map((question) => [question.id, question.text]) ?? [],
  );

  function analyze() {
    setLoading(true);
    setTimeout(() => {
      const nextAnalysis: AnalysisResult = {
        summary:
          "Candidate shows solid communication, structured thinking, and a clear approach to problem solving.",
        strengths: [
          "Clear answers",
          "Good problem solving",
          "Consistent logic",
        ],
        concerns: ["Limited system design depth"],
        recommendation: "advance",
      };

      saveAnalysis(submissionId, nextAnalysis);
      setAnalysis(nextAnalysis);
      setLoading(false);
    }, 1200);
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link href="/jobs">Jobs</Link>
          <Icon name="chevron_forward" className={styles.breadcrumbschevron} />
          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
          <Icon name="chevron_forward" className={styles.breadcrumbschevron} />
          <span className={styles.breadcrumbCurrent}>Applicant</span>
        </div>

        <div className={styles.headerRow}>
          <div className={styles.applicantInfo}>
            <div className={styles.applicantAvatar}>
              {submission.candidateName
                .split(" ")
                .slice(0, 2)
                .map((part: string) => part.charAt(0))
                .join("")
                .toUpperCase()}
            </div>

            <div className={styles.applicantDetails}>
              <div className={styles.nameRow}>
                <h1 className={styles.title}>{submission.candidateName}</h1>
                <span className={styles.roleChip}>{job.title}</span>
              </div>
              <div className={styles.metaLine}>
                <Icon name="mail" size={14} className={styles.metaIcon} />
                <span>{submission.candidateEmail}</span>
                <span className={styles.metaSeparator} aria-hidden="true">
                  &middot;
                </span>
                <Icon name="schedule" size={14} className={styles.metaIcon} />
                <span>
                  Applied {formatRelativeTime(submission.submittedAt)}
                </span>
              </div>
            </div>
          </div>
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
                          <AudioPlayer hasAudio />
                          <div className={styles.transcriptSection}>
                            <p className={styles.transcriptPlaceholder}>
                              {answer.value ||
                                "Transcript will appear after analysis."}
                            </p>
                          </div>
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
                  <Icon
                    name="auto_awesome"
                    size={20}
                    className={styles.sparkIcon}
                  />
                  <h2>AI Insights</h2>
                </div>
              </div>

              {analysis ? (
                <div className={styles.analysisBody}>
                  <p className={styles.cacheNote}>
                    Cached locally for this submission. Regenerate if you want a
                    fresh analysis.
                  </p>

                  <section className={styles.analysisSection}>
                    <h3 className={styles.analysisLabel}>Summary</h3>
                    <p className={styles.analysisText}>{analysis.summary}</p>
                  </section>

                  <section className={styles.analysisSection}>
                    <h3 className={styles.analysisLabel}>Key Strengths</h3>
                    <ul className={styles.checkList}>
                      {analysis.strengths.map((strength) => (
                        <li key={strength} className={styles.checkItem}>
                          <Icon
                            name="check_circle"
                            size={16}
                            fill
                            className={styles.checkIcon}
                          />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.analysisSection}>
                    <h3 className={styles.analysisLabel}>Areas for Review</h3>
                    <div className={styles.reviewBox}>
                      <Icon
                        name="warning"
                        size={16}
                        className={styles.warningIcon}
                      />
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
                        onClick={analyze}
                        disabled={loading}
                      >
                        {loading ? "Regenerating..." : "Regenerate Analysis"}
                      </button>
                    </div>
                  </section>
                </div>
              ) : (
                <div className={styles.analysisPlaceholder}>
                  <Icon name="psychology" size={32} />
                  <p>Run analysis to generate recruiter guidance.</p>
                  <button
                    className={styles.primaryAnalysisButton}
                    type="button"
                    onClick={analyze}
                    disabled={loading}
                  >
                    {loading ? "Analyzing..." : "Analyze Response"}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
