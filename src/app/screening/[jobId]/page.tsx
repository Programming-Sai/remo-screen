"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { jobs } from "@/data/jobs";
import { getScreeningByJobId, saveSubmission } from "@/lib/storage";
import { Submission } from "@/types";

import ScreeningShell from "@/components/candidate/ScreeningShell/ScreeningShell";
import ScreeningWelcomeStep from "@/components/candidate/ScreeningWelcomeStep/ScreeningWelcomeStep";
import ScreeningQuestionStep from "@/components/candidate/ScreeningQuestionStep/ScreeningQuestionStep";
import ScreeningCompletionStep from "@/components/candidate/ScreeningCompletionStep/ScreeningCompletionStep";

type ScreenState = "welcome" | "question" | "complete";

export default function ScreeningPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params?.jobId as string;

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobId]);
  const screening = getScreeningByJobId(jobId);

  const [state, setState] = useState<ScreenState>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!job) return <p>Job not found</p>;
  if (!screening) return <p>No screening found</p>;

  const questions = screening.questions;
  const currentQuestion = questions[questionIndex];
  const currentValue = answers[currentQuestion?.id] ?? "";
  const progressPercent = Math.round(
    ((questionIndex + 1) / questions.length) * 100,
  );

  function startScreening() {
    if (!candidateName.trim() || !candidateEmail.trim()) return;
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

  return (
    <ScreeningShell>
      {state === "welcome" && (
        <ScreeningWelcomeStep
          jobTitle={job.title}
          questionCount={questions.length}
          candidateName={candidateName}
          candidateEmail={candidateEmail}
          onCandidateNameChange={setCandidateName}
          onCandidateEmailChange={setCandidateEmail}
          onStart={startScreening}
        />
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
        <ScreeningCompletionStep
          jobTitle={job.title}
          onReturnToDashboard={() => router.push("/jobs")}
        />
      )}
    </ScreeningShell>
  );
}
