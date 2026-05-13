"use client";

import styles from "@/app/screening/[jobId]/page.module.css";
import { Icon } from "@/components/ui/Icon/Icon";

type Question = {
  id: string;
  text: string;
  responseType: "text" | "audio";
};

interface ScreeningQuestionStepProps {
  question: Question;
  value: string;
  stepIndex: number;
  totalSteps: number;
  progressPercent: number;
  onValueChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ScreeningQuestionStep({
  question,
  value,
  stepIndex,
  totalSteps,
  progressPercent,
  onValueChange,
  onBack,
  onNext,
}: ScreeningQuestionStepProps) {
  return (
    <div className={styles.content}>
      <div className={styles.progressBlock}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>
            Question {stepIndex + 1} of {totalSteps}
          </span>
          <span className={styles.progressPercent}>
            {progressPercent}% Complete
          </span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <section className={styles.questionShell}>
        <div className={styles.questionAccent} />
        <div className={styles.questionBody}>
          <h2 className={styles.questionTitle}>{question.text}</h2>

          {question.responseType === "audio" && (
            <div className={styles.audioBox}>
              <div className={styles.audioIconWrap}>
                <Icon name="mic_off" size={32} />
              </div>
              <p className={styles.audioTitle}>Audio Submission Disabled</p>
              <p className={styles.audioText}>
                For this demo, please use a text response below.
              </p>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="text-response">
              Your text response
            </label>
            <textarea
              id="text-response"
              className={styles.textarea}
              placeholder="Type your answer here..."
              rows={6}
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
            />
          </div>

          <div className={styles.buttonRow}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onBack}
              disabled={stepIndex === 0}
            >
              Previous
            </button>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={onNext}
              disabled={!value.trim()}
            >
              Next Question
            </button>
          </div>
        </div>
      </section>

      <div className={styles.tipRow}>
        <span className={styles.tipIcon}>
          <Icon name="lightbulb" size={20} />
        </span>
        <p className={styles.tipText}>
          Tip: Focus on communication protocols, asynchronous workflows, and
          specific rituals that bridge the geographical gap.
        </p>
      </div>
    </div>
  );
}
