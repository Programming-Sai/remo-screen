import { AnalysisResult, Job, Screening, Submission } from "@/types";

const STORAGE_KEYS = {
  JOBS: "aihrly_jobs",
  SCREENINGS: "aihrly_screenings",
  SUBMISSIONS: "aihrly_submissions",
  ANALYSES: "aihrly_analyses",
} as const;

/* ---------------------------
   SAFE STORAGE CORE
--------------------------- */

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(key);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors for now
  }
}

/* ---------------------------
   JOBS (STATIC SOURCE OF TRUTH)
--------------------------- */

export function getJobs(): Job[] {
  return read<Job>(STORAGE_KEYS.JOBS);
}

export function seedJobs(jobs: Job[]) {
  const existing = getJobs();

  if (existing.length === 0) {
    write(STORAGE_KEYS.JOBS, jobs);
  }
}

export function getJobById(jobId: string): Job | undefined {
  return getJobs().find((job) => job.id === jobId);
}

/* ---------------------------
   SCREENINGS
--------------------------- */

export function getScreenings(): Screening[] {
  return read<Screening>(STORAGE_KEYS.SCREENINGS).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getScreeningsByJob(jobId: string): Screening[] {
  return getScreenings().filter((s) => s.jobId === jobId);
}

export function getScreeningById(id: string): Screening | undefined {
  return getScreenings().find((s) => s.id === id);
}

/* FIX for your error */
export function getScreeningByJobId(jobId: string): Screening | undefined {
  return getScreenings().find((s) => s.jobId === jobId);
}

export function saveScreening(screening: Screening) {
  const screenings = getScreenings();

  screenings.push(screening);
  write(STORAGE_KEYS.SCREENINGS, screenings);
}

export function hasScreeningForJob(jobId: string): boolean {
  return getScreeningsByJob(jobId).length > 0;
}

/* ---------------------------
   SUBMISSIONS (CANDIDATES)
--------------------------- */

export function getSubmissions(): Submission[] {
  return read<Submission>(STORAGE_KEYS.SUBMISSIONS).sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

/* FIX for your error */
export function getSubmissionsByJob(jobId: string): Submission[] {
  return getSubmissions().filter((s) => s.jobId === jobId);
}

export function getSubmissionById(id: string): Submission | undefined {
  return getSubmissions().find((s) => s.id === id);
}

export function saveSubmission(submission: Submission) {
  const submissions = getSubmissions();

  submissions.push(submission);
  write(STORAGE_KEYS.SUBMISSIONS, submissions);
}

export function getApplicantCount(jobId: string): number {
  return getSubmissionsByJob(jobId).length;
}

/* ---------------------------
   ANALYSES (RECRUITER)
--------------------------- */

export function getAnalyses(): Record<string, AnalysisResult> {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
    if (!data) return {};

    const parsed = JSON.parse(data);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, AnalysisResult>)
      : {};
  } catch {
    return {};
  }
}

export function getAnalysisBySubmissionId(
  submissionId: string,
): AnalysisResult | undefined {
  return getAnalyses()[submissionId];
}

export function saveAnalysis(
  submissionId: string,
  analysis: AnalysisResult,
): void {
  if (typeof window === "undefined") return;

  try {
    const analyses = getAnalyses();
    analyses[submissionId] = analysis;
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
  } catch {
    // ignore write errors for now
  }
}

export function clearAnalysis(submissionId: string): void {
  if (typeof window === "undefined") return;

  try {
    const analyses = getAnalyses();
    delete analyses[submissionId];
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
  } catch {
    // ignore write errors for now
  }
}

/* ---------------------------
   UTILITY
--------------------------- */

export function clearAllStorage() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.JOBS);
  localStorage.removeItem(STORAGE_KEYS.SCREENINGS);
  localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  localStorage.removeItem(STORAGE_KEYS.ANALYSES);
}
