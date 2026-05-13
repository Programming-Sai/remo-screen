"use client";

import { useRef, useState } from "react";
import type { RefObject } from "react";
import { useRouter } from "next/navigation";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";

import Modal from "@/components/ui/Modal/Modal";
import { Icon } from "@/components/ui/Icon/Icon";

import { jobs } from "@/data/jobs";
import { generateQuestions } from "@/data/questions";

import { Question, ResponseType, Screening } from "@/types";

import { saveScreening } from "@/lib/storage";

import styles from "./CreateScreeningModal.module.css";
import { useToast } from "@/contexts/ToastContext";

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
  const { showToast } = useToast();

  const [selectedJobId, setSelectedJobId] = useState(jobId ?? "");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [overQuestionId, setOverQuestionId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const questionRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  function registerQuestionRef(id: string, node: HTMLTextAreaElement | null) {
    questionRefs.current[id] = node;
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleGenerateQuestions() {
    if (!selectedJobId) return;

    setLoading(true);

    setTimeout(() => {
      const generated = generateQuestions(selectedJobId);

      const formattedQuestions: Question[] = generated.map((question) => ({
        id: crypto.randomUUID(),
        text: question,
        responseType: "text",
        isCustom: false,
      }));

      setQuestions(formattedQuestions);
      setLoading(false);
    }, 600);
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
        question.id === id ? { ...question, responseType: value } : question,
      ),
    );
  }

  function handleRemoveQuestion(id: string) {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
    if (editingQuestionId === id) {
      setEditingQuestionId(null);
    }
  }

  function handleMoveQuestion(id: string, direction: "up" | "down") {
    setQuestions((prev) => {
      const index = prev.findIndex((question) => question.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      return arrayMove(prev, index, targetIndex);
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveQuestionId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    setOverQuestionId(event.over ? String(event.over.id) : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex(
          (question) => question.id === active.id,
        );
        const newIndex = prev.findIndex((question) => question.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return prev;

        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    setActiveQuestionId(null);
    setOverQuestionId(null);
  }

  function handleDragCancel() {
    setActiveQuestionId(null);
    setOverQuestionId(null);
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

  function handleClose() {
    if (!jobId) {
      setSelectedJobId("");
    }
    setQuestions([]);
    setLoading(false);
    setActiveQuestionId(null);
    setOverQuestionId(null);
    setEditingQuestionId(null);
    onClose();
  }

  function handleSaveScreening() {
    if (!selectedJobId || questions.length === 0) {
      showToast({
        type: "error",
        title: "Missing information",
        message: "Please select a job and add questions.",
      });
      return;
    }

    const screening: Screening = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      jobId: selectedJobId,
      questions,
    };

    saveScreening(screening);
    if (!jobId) {
      setSelectedJobId("");
    }
    setQuestions([]);
    setLoading(false);
    setActiveQuestionId(null);
    setOverQuestionId(null);
    setEditingQuestionId(null);
    onClose();
    router.push(`/jobs/${selectedJobId}`);

    showToast({
      type: "success",
      title: "Screening created",
      message: "You can now share the candidate link from the job detail page.",
      actionLabel: "Open Job",
      onAction: () => router.push(`/jobs/${selectedJobId}`),
      duration: 7000,
    });
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

        <button
          className={styles.closeButton}
          type="button"
          onClick={handleClose}
        >
          <Icon name="close" />
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
            type="button"
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

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={questions.map((question) => question.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.questions}>
                  {questions.map((question, index) => (
                    <SortableQuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      totalQuestions={questions.length}
                      onQuestionTextChange={handleQuestionTextChange}
                      onRemoveQuestion={handleRemoveQuestion}
                      onResponseTypeChange={handleResponseTypeChange}
                      onMoveQuestion={handleMoveQuestion}
                      registerQuestionRef={registerQuestionRef}
                      questionRefs={questionRefs}
                      editingQuestionId={editingQuestionId}
                      setEditingQuestionId={setEditingQuestionId}
                      isActive={activeQuestionId === question.id}
                      isOver={overQuestionId === question.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              className={styles.addButton}
              type="button"
              onClick={handleAddCustomQuestion}
            >
              + Add Custom Question
            </button>
          </section>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={handleClose}
        >
          Discard
        </button>

        <button
          className={styles.primaryButton}
          type="button"
          onClick={handleSaveScreening}
          disabled={!selectedJobId || questions.length === 0}
        >
          Save Screening
        </button>
      </div>
    </Modal>
  );
}

interface SortableQuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  isActive: boolean;
  isOver: boolean;
  onQuestionTextChange: (id: string, value: string) => void;
  onResponseTypeChange: (id: string, value: ResponseType) => void;
  onRemoveQuestion: (id: string) => void;
  onMoveQuestion: (id: string, direction: "up" | "down") => void;
  registerQuestionRef: (id: string, node: HTMLTextAreaElement | null) => void;
  questionRefs: RefObject<Record<string, HTMLTextAreaElement | null>>;
  editingQuestionId: string | null;
  setEditingQuestionId: (id: string | null) => void;
}

function SortableQuestionCard({
  question,
  index,
  totalQuestions,
  isActive,
  isOver,
  onQuestionTextChange,
  onResponseTypeChange,
  onRemoveQuestion,
  onMoveQuestion,
  registerQuestionRef,
  questionRefs,
  editingQuestionId,
  setEditingQuestionId,
}: SortableQuestionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const cardStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const isEditing = editingQuestionId === question.id;

  function toggleEdit() {
    if (isEditing) {
      setEditingQuestionId(null);
      return;
    }

    setEditingQuestionId(question.id);
    window.setTimeout(() => {
      questionRefs.current?.[question.id]?.focus();
    }, 0);
  }

  return (
    <div
      ref={setNodeRef}
      className={`${styles.questionCard} ${
        isDragging || isActive ? styles.questionDragging : ""
      } ${isOver ? styles.questionDropTarget : ""}`.trim()}
      style={cardStyle}
      {...attributes}
      {...listeners}
    >
      <div className={styles.questionHeader}>
        <div className={styles.questionHeaderLeft}>
          <span className={styles.dragIcon} aria-hidden="true">
            <Icon name="drag_indicator" size={18} />
          </span>

          <span className={styles.questionIndex}>
            {question.isCustom ? "Custom question" : `Question ${index + 1}`}
          </span>
        </div>

        <div className={styles.questionActions}>
          <button
            className={styles.editButton}
            type="button"
            onClick={toggleEdit}
            aria-label={isEditing ? "Finish editing question" : "Edit question"}
          >
            <Icon name="edit" size={18} />
          </button>
          <button
            className={styles.moveButton}
            type="button"
            onClick={() => onMoveQuestion(question.id, "up")}
            disabled={index === 0}
            aria-label="Move question up"
          >
            <Icon name="keyboard_arrow_up" />
          </button>
          <button
            className={styles.moveButton}
            type="button"
            onClick={() => onMoveQuestion(question.id, "down")}
            disabled={index === totalQuestions - 1}
            aria-label="Move question down"
          >
            <Icon name="keyboard_arrow_down" />
          </button>
        </div>
      </div>

      <div className={styles.questionTop}>
        <textarea
          rows={3}
          ref={(node) => registerQuestionRef(question.id, node)}
          className={styles.questionInput}
          readOnly={!isEditing}
          aria-readonly={!isEditing}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Enter question text..."
          value={question.text}
          onChange={(e) => onQuestionTextChange(question.id, e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
        />

        <button
          className={styles.removeButton}
          type="button"
          aria-label="Delete question"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onRemoveQuestion(question.id)}
        >
          <Icon name="delete_outline" size={18} />
        </button>
      </div>

      <div className={styles.questionFooter}>
        <span className={styles.responseLabel}>Response Type</span>

        <select
          className={styles.responseSelect}
          value={question.responseType}
          onChange={(e) =>
            onResponseTypeChange(question.id, e.target.value as ResponseType)
          }
        >
          <option value="text">Text</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {question.responseType === "audio" && (
        <div className={styles.audioPreview}>
          <div className={styles.audioIcon}>
            <Icon name="mic" />
          </div>

          <div>
            <p>Audio response enabled</p>

            <span>
              Candidates will record an audio response for this question.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
