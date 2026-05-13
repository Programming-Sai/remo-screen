"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { jobs } from "@/data/jobs";
import {
  getScreeningByJobId,
  saveSubmission,
  getSubmissionsByJob,
} from "@/lib/storage";
import { Submission } from "@/types";
import styles from "./page.module.css";
import ScreeningShell from "@/components/candidate/ScreeningShell/ScreeningShell";
import ScreeningWelcomeStep from "@/components/candidate/ScreeningWelcomeStep/ScreeningWelcomeStep";
import ScreeningQuestionStep from "@/components/candidate/ScreeningQuestionStep/ScreeningQuestionStep";
import ScreeningCompletionStep from "@/components/candidate/ScreeningCompletionStep/ScreeningCompletionStep";
import { useToast } from "@/contexts/ToastContext";
import NotFoundState from "@/components/ui/NotFoundState/NotFoundState";

type ScreenState = "welcome" | "question" | "complete";

export default function ScreeningPage() {
  const params = useParams();
  const jobId = params?.jobId as string;

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobId]);
  const screening = getScreeningByJobId(jobId);

  const [state, setState] = useState<ScreenState>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const { showToast } = useToast();

  if (!job) {
    return (
      <ScreeningShell>
        <NotFoundState
          eyebrow="Missing job"
          icon="work_off"
          title="This screening job could not be found"
          description="The screening link may be outdated, or the job may have been removed."
          bullets={[
            "Go back to the recruiter jobs page and confirm the job still exists.",
            "If you were sent this link, ask the recruiter to resend the updated candidate link.",
          ]}
          primaryAction={{
            label: "Back to Jobs",
            href: "/jobs",
            icon: "arrow_back",
          }}
        />
      </ScreeningShell>
    );
  }

  if (!screening) {
    return (
      <ScreeningShell>
        <NotFoundState
          eyebrow="No screening"
          icon="quiz_off"
          title="This job does not have a screening yet"
          description="Recruiters need to generate questions before candidates can start this link."
          bullets={[
            "If you are the recruiter, open the job detail page and create a screening first.",
            "If you are a candidate, check back once the recruiter shares the live link.",
          ]}
          primaryAction={{
            label: "Back to Job",
            href: `/jobs/${job.id}`,
            icon: "work",
          }}
          secondaryAction={{
            label: "Back to Jobs",
            href: "/jobs",
            icon: "work",
            variant: "secondary",
          }}
        />
      </ScreeningShell>
    );
  }

  const questions = screening.questions;
  const currentQuestion = questions[questionIndex];
  const currentValue = answers[currentQuestion?.id] ?? "";
  const progressPercent = Math.round(
    ((questionIndex + 1) / questions.length) * 100,
  );

  function startScreening() {
    const trimmedName = candidateName.trim();
    const trimmedEmail = candidateEmail.trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedName || !trimmedEmail) {
      setError("Please enter both name and email");
      return;
    }

    if (!emailIsValid) {
      setError("Please enter a valid email address");
      return;
    }

    // Check for duplicate submission - do it fresh each time
    const existingSubmissions = getSubmissionsByJob(jobId);
    const hasExisting = existingSubmissions.some(
      (sub) => sub.candidateEmail.toLowerCase() === trimmedEmail.toLowerCase(),
    );

    if (hasExisting) {
      showToast({
        type: "error",
        title: "Duplicate submission",
        message: "An application with this email already exists.",
      });
      return;
    }

    setError("");
    setState("question");
    setQuestionIndex(0);
  }

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  function handleNext() {
    const value = (answers[currentQuestion.id] ?? "").trim();
    if (!value) return;

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    const submission: Submission = {
      id: crypto.randomUUID(),
      jobId,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      answers: questions.map((question) => ({
        questionId: question.id,
        responseType: question.responseType,
        value: answers[question.id] ?? "",
      })),
      submittedAt: new Date().toISOString(),
    };

    saveSubmission(submission);
    setState("complete");
  }

  function handleBack() {
    if (questionIndex === 0) {
      setState("welcome");
      return;
    }
    setQuestionIndex((prev) => Math.max(0, prev - 1));
  }

  function handleClose() {
    window.close();
  }

  return (
    <ScreeningShell>
      {state === "welcome" && (
        <>
          <ScreeningWelcomeStep
            jobTitle={job.title}
            questionCount={questions.length}
            candidateName={candidateName}
            candidateEmail={candidateEmail}
            onCandidateNameChange={setCandidateName}
            onCandidateEmailChange={setCandidateEmail}
            onStart={startScreening}
          />
          {error && <div className={styles.error}>{error}</div>}
        </>
      )}

      {state === "question" && currentQuestion && (
        <ScreeningQuestionStep
          question={currentQuestion}
          value={currentValue}
          stepIndex={questionIndex}
          totalSteps={questions.length}
          progressPercent={progressPercent}
          onValueChange={(value) => setAnswer(currentQuestion.id, value)}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {state === "complete" && (
        <ScreeningCompletionStep jobTitle={job.title} onClose={handleClose} />
      )}
    </ScreeningShell>
  );
}
