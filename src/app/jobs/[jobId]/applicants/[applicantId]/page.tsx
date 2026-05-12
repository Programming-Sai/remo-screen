"use client";

import { useParams, useRouter } from "next/navigation";
import { getSubmissionById } from "@/lib/storage";
import { jobs } from "@/data/jobs";
import styles from "./page.module.css";
import { useState } from "react";

type AnalysisResult = {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendation: "advance" | "reject" | "hold";
};

export default function ApplicantPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params?.jobId as string;
  const applicantId = params?.applicantId as string;

  const job = jobs.find((j) => j.id === jobId);
  const submission = getSubmissionById(applicantId);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  if (!job) return <p>Job not found</p>;
  if (!submission) return <p>Applicant not found</p>;

  function analyze() {
    setLoading(true);

    setTimeout(() => {
      setAnalysis({
        summary: "Candidate shows solid communication and structured thinking.",
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
    <div className={styles.container}>
      <button onClick={() => router.push(`/jobs/${jobId}`)}>← Back</button>

      <h1>{submission.candidateName}</h1>
      <p>{submission.candidateEmail}</p>
      <p>{submission.submittedAt}</p>

      <div className={styles.section}>
        <h3>Answers</h3>

        {submission.answers.map((a) => (
          <div key={a.questionId} className={styles.answerCard}>
            <p>
              <b>Question ID:</b> {a.questionId}
            </p>
            <p>{a.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <button onClick={analyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Response"}
        </button>

        {analysis && (
          <div className={styles.analysis}>
            <h3>AI Analysis (Mock)</h3>

            <p>
              <b>Summary:</b> {analysis.summary}
            </p>

            <p>
              <b>Strengths:</b>
            </p>
            <ul>
              {analysis.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <p>
              <b>Concerns:</b>
            </p>
            <ul>
              {analysis.concerns.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <p>
              <b>Recommendation:</b> {analysis.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
