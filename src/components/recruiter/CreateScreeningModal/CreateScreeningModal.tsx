"use client";

import { useMemo, useState } from "react";
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

  const selectedJob = useMemo(() => {
    return jobs.find((job) => job.id === selectedJobId);
  }, [selectedJobId]);

  function handleGenerateQuestions() {
    if (!selectedJobId) return;

    setLoading(true);

    setTimeout(() => {
      const generated = generateQuestions(selectedJobId);

      const formattedQuestions: Question[] = generated.map(
        (question, index) => ({
          id: crypto.randomUUID(),
          text: question,
          responseType: index === 0 ? "audio" : "text",
          isCustom: false,
        }),
      );

      setQuestions(formattedQuestions);

      setLoading(false);
    }, 800);
  }

  function handleQuestionTextChange(id: string, value: string) {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id ? { ...question, text: value } : question,
      ),
    );
  }

  function handleResponseTypeChange(id: string, value: ResponseType) {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id
          ? {
              ...question,
              responseType: value,
            }
          : question,
      ),
    );
  }

  function handleRemoveQuestion(id: string) {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
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
    if (!selectedJobId || questions.length === 0) {
      return;
    }

    const screening: Screening = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      jobId: selectedJobId,
      questions,
    };

    saveScreening(screening);

    onClose();

    router.push(`/jobs/${selectedJobId}`);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Create Phone Screening</h2>

          <p className={styles.subtitle}>
            Generate and customize screening questions.
          </p>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.body}>
        {!jobId && (
          <section className={styles.section}>
            <label className={styles.label}>Job Posting</label>

            <select
              className={styles.select}
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
          </section>
        )}

        <section className={styles.generateSection}>
          <div className={styles.generateText}>
            <h3>Generate screening questions with AI</h3>

            <p>
              Questions are tailored to the role requirements and communication
              style.
            </p>
          </div>

          <button
            className={styles.generateButton}
            onClick={handleGenerateQuestions}
            disabled={!selectedJobId || loading}
          >
            {loading ? "Generating questions..." : "Generate Questions"}
          </button>
        </section>

        {questions.length > 0 && (
          <section className={styles.questionsSection}>
            <div className={styles.questionsHeader}>
              <h4>Screening Questions ({questions.length})</h4>
            </div>

            <div className={styles.questions}>
              {questions.map((question) => (
                <div key={question.id} className={styles.questionCard}>
                  <div className={styles.questionTop}>
                    <textarea
                      rows={3}
                      className={styles.questionInput}
                      placeholder="Enter question text..."
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionTextChange(question.id, e.target.value)
                      }
                    />

                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveQuestion(question.id)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className={styles.questionFooter}>
                    <span className={styles.responseLabel}>Response Type</span>

                    <select
                      className={styles.responseSelect}
                      value={question.responseType}
                      onChange={(e) =>
                        handleResponseTypeChange(
                          question.id,
                          e.target.value as ResponseType,
                        )
                      }
                    >
                      <option value="text">Text</option>

                      <option value="audio">Audio</option>
                    </select>
                  </div>

                  {question.responseType === "audio" && (
                    <div className={styles.audioPreview}>
                      <div className={styles.audioIcon}>🎤</div>

                      <div>
                        <p>Audio response enabled</p>

                        <span>
                          Candidates will record an audio response for this
                          question.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              className={styles.addButton}
              onClick={handleAddCustomQuestion}
            >
              + Add Custom Question
            </button>
          </section>
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.secondaryButton} onClick={onClose}>
          Discard
        </button>

        <button
          className={styles.primaryButton}
          onClick={handleSaveScreening}
          disabled={!selectedJobId || questions.length === 0}
        >
          Save Screening
        </button>
      </div>
    </Modal>
  );
}
