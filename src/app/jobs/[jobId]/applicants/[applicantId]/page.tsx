"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { jobs } from "@/data/jobs";
import { getScreeningByJobId, getSubmissionById } from "@/lib/storage";
import { formatRelativeTime } from "@/lib/timeFormat";

import styles from "./page.module.css";
import { Header } from "@/components/ui/Header/Header";
import { Icon } from "@/components/ui/Icon/Icon";
import AudioPlayer from "@/components/recruiter/CreateScreeningModal/AudioPlayer/AudioPlayer";
import { Submission } from "@/types";

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
  const [transcriptLoading, setTranscriptLoading] = useState<
    Record<string, boolean>
  >({});
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});

  // Early returns - must be after all hooks

  const questionMap = new Map(
    screening?.questions.map((question) => [question.id, question.text]) ?? [],
  );

  // Simulate transcript loading for audio answers
  useEffect(() => {
    if (!submission) return;

    submission.answers.forEach((answer) => {
      if (answer.responseType === "audio" && !transcripts[answer.questionId]) {
        setTranscriptLoading((prev) => ({
          ...prev,
          [answer.questionId]: true,
        }));
        setTimeout(() => {
          setTranscripts((prev) => ({
            ...prev,
            [answer.questionId]: answer.value,
          }));
          setTranscriptLoading((prev) => ({
            ...prev,
            [answer.questionId]: false,
          }));
        }, 1800);
      }
    });
  }, [submission, transcripts]);

  if (!submission) return <p>Applicant not found</p>;
  if (!job) return <p>Job not found</p>;

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
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link href="/jobs">Jobs</Link>
          <span>›</span>
          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
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

            <div className={styles.applicantDetails}>
              <div className={styles.nameRow}>
                <h1 className={styles.title}>{submission.candidateName}</h1>
                <span className={styles.roleChip}>{job.title}</span>
              </div>
              <div className={styles.metaLine}>
                <Icon name="mail" size={14} className={styles.metaIcon} />
                <span>{submission.candidateEmail}</span>
                <span className={styles.metaSeparator}>•</span>
                <Icon name="schedule" size={14} className={styles.metaIcon} />
                <span>
                  Applied {formatRelativeTime(submission.submittedAt)}
                </span>
              </div>
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
                          <AudioPlayer />
                          <div className={styles.transcriptSection}>
                            {transcriptLoading[answer.questionId] ? (
                              <div className={styles.transcriptLoading}>
                                <Icon name="mic" size={16} />
                                <span>Processing transcript...</span>
                              </div>
                            ) : transcripts[answer.questionId] ? (
                              <p className={styles.transcript}>
                                {transcripts[answer.questionId]}
                              </p>
                            ) : (
                              <p className={styles.transcriptPlaceholder}>
                                Transcript will appear after analysis.
                              </p>
                            )}
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
                      >
                        Schedule Interview
                      </button>
                    </div>
                  </section>
                </div>
              ) : (
                <div className={styles.analysisPlaceholder}>
                  <Icon name="psychology" size={32} />
                  <p>Run analysis to generate recruiter guidance.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
