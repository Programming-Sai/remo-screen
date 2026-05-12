"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal/Modal";

import { jobs } from "@/data/jobs";
import { generateQuestions } from "@/data/questions";

import { Question, ResponseType, Screening } from "@/types";
import { saveScreening } from "@/lib/storage";

import styles from "./CreateScreeningModal.module.css";

interface CreateScreeningModalProps {
  isOpen: boolean;
  jobId?: string;
  onClose: () => void;
}

export default function CreateScreeningModal({
  isOpen,
  jobId,
  onClose,
}: CreateScreeningModalProps) {
  const router = useRouter();

  const [selectedJobId, setSelectedJobId] = useState(jobId ?? "");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  function handleGenerateQuestions() {
    if (!selectedJobId) return;

    setLoading(true);

    setTimeout(() => {
      const generated = generateQuestions(selectedJobId);

      const formattedQuestions: Question[] = generated.map((q) => ({
        id: crypto.randomUUID(),
        text: q,
        responseType: "text",
        isCustom: false,
      }));

      setQuestions(formattedQuestions);
      setLoading(false);
    }, 700);
  }

  function handleQuestionTextChange(id: string, value: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: value } : q)),
    );
  }

  function handleResponseTypeChange(id: string, value: ResponseType) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, responseType: value } : q)),
    );
  }

  function handleRemoveQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function handleAddCustomQuestion() {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: "",
      responseType: "text",
      isCustom: true,
    };

    setQuestions((prev) => [...prev, newQuestion]);
  }

  function handleSaveScreening() {
    if (!selectedJobId) return;

    const screening: Screening = {
      id: crypto.randomUUID(),
      jobId: selectedJobId,
      createdAt: new Date().toISOString(),
      questions,
    };

    saveScreening(screening);

    onClose();
    router.push(`/jobs/${selectedJobId}`);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2>Create Phone Screening</h2>

        {!jobId && (
          <div className={styles.section}>
            <label>Select Job</label>

            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              <option value="">Choose a job</option>

              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.section}>
          <button onClick={handleGenerateQuestions}>Generate Questions</button>

          {loading && <p>Generating questions...</p>}
        </div>

        <div className={styles.questions}>
          {questions.map((q) => (
            <div key={q.id} className={styles.questionCard}>
              <input
                type="text"
                value={q.text}
                onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
              />

              <select
                value={q.responseType}
                onChange={(e) =>
                  handleResponseTypeChange(q.id, e.target.value as ResponseType)
                }
              >
                <option value="text">Text</option>
                <option value="audio">Audio</option>
              </select>

              <button onClick={() => handleRemoveQuestion(q.id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={handleAddCustomQuestion}>Add Custom Question</button>

          <button onClick={handleSaveScreening}>Save Screening</button>
        </div>
      </div>
    </Modal>
  );
}
