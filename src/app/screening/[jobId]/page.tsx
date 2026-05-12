"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jobs } from "@/data/jobs";
import { getScreeningByJobId, saveSubmission } from "@/lib/storage";
import { Answer, Submission } from "@/types";
import styles from "./page.module.css";

export default function ScreeningPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params?.jobId as string;

  const job = jobs.find((j) => j.id === jobId);
  const screening = getScreeningByJobId(jobId);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [started, setStarted] = useState(false);

  if (!job) return <p>Job not found</p>;
  if (!screening) return <p>No screening found</p>;

  const questions = screening.questions;
  const current = questions[step];

  function start() {
    if (!name.trim() || !email.trim()) return;
    setStarted(true);
  }

  function handleAnswer(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;

    const newAnswer: Answer = {
      questionId: current.id,
      responseType: current.responseType,
      value: trimmed,
    };

    const updated = [...answers, newAnswer];
    setAnswers(updated);

    const nextStep = step + 1;

    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      finish(updated);
    }
  }

  function finish(finalAnswers: Answer[]) {
    const submission: Submission = {
      id: crypto.randomUUID(),
      jobId,
      candidateName: name,
      candidateEmail: email,
      answers: finalAnswers,
      submittedAt: new Date().toISOString(),
    };

    saveSubmission(submission);
    router.push(`/jobs/${jobId}`);
  }

  if (!started) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>{job.title}</h1>

          <input
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className={styles.button}
            onClick={start}
            disabled={!name || !email}
          >
            Start Screening
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.progress}>
        Question {step + 1} of {questions.length}
      </p>

      <div className={styles.card}>
        <h2 className={styles.title}>{current.text}</h2>

        <textarea
          className={styles.input}
          placeholder="Type your answer..."
          onBlur={(e) => handleAnswer(e.target.value)}
        />
      </div>
    </div>
  );
}
