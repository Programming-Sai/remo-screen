import {
  AnalysisResult,
  CandidateSession,
  Job,
  Screening,
  Submission,
} from "@/types";

const STORAGE_KEYS = {
  JOBS: "aihrly_jobs",
  SCREENINGS: "aihrly_screenings",
  SUBMISSIONS: "aihrly_submissions",
  ANALYSES: "aihrly_analyses",
  CANDIDATE_SESSIONS: "aihrly_candidate_sessions",
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

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isCandidateSession(value: unknown): value is CandidateSession {
  if (!value || typeof value !== "object") return false;

  const session = value as Record<string, unknown>;
  return (
    typeof session.id === "string" &&
    typeof session.jobId === "string" &&
    typeof session.candidateName === "string" &&
    typeof session.candidateEmail === "string" &&
    typeof session.questionIndex === "number" &&
    typeof session.questionCount === "number" &&
    typeof session.answers === "object" &&
    session.answers !== null &&
    !Array.isArray(session.answers) &&
    typeof session.startedAt === "string" &&
    typeof session.updatedAt === "string"
  );
}

function getCandidateSessionsFromStorage(): CandidateSession[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.CANDIDATE_SESSIONS);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter(isCandidateSession) : [];
  } catch {
    return [];
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
   CANDIDATE SESSIONS (DRAFTS)
--------------------------- */

export function getCandidateSessions(): CandidateSession[] {
  return getCandidateSessionsFromStorage().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getCandidateSessionByJobId(
  jobId: string,
): CandidateSession | undefined {
  return getCandidateSessions().find((session) => session.jobId === jobId);
}

export function getCandidateSessionByJobIdAndEmail(
  jobId: string,
  candidateEmail: string,
): CandidateSession | undefined {
  const normalizedEmail = normalizeEmail(candidateEmail);

  return getCandidateSessions().find(
    (session) =>
      session.jobId === jobId &&
      normalizeEmail(session.candidateEmail) === normalizedEmail,
  );
}

export function getCandidateSessionsByJob(jobId: string): CandidateSession[] {
  return getCandidateSessions().filter((session) => session.jobId === jobId);
}

export function saveCandidateSession(session: CandidateSession): void {
  if (typeof window === "undefined") return;

  try {
    const sessions = getCandidateSessions().filter(
      (existing) =>
        !(
          existing.jobId === session.jobId &&
          normalizeEmail(existing.candidateEmail) ===
            normalizeEmail(session.candidateEmail)
        ),
    );

    sessions.push(session);
    localStorage.setItem(
      STORAGE_KEYS.CANDIDATE_SESSIONS,
      JSON.stringify(sessions),
    );
  } catch {
    // ignore write errors for now
  }
}

export function clearCandidateSession(
  jobId: string,
  candidateEmail?: string,
): void {
  if (typeof window === "undefined") return;

  try {
    const sessions = getCandidateSessions().filter((existing) => {
      if (existing.jobId !== jobId) return true;
      if (!candidateEmail) return false;

      return (
        normalizeEmail(existing.candidateEmail) !==
        normalizeEmail(candidateEmail)
      );
    });

    localStorage.setItem(
      STORAGE_KEYS.CANDIDATE_SESSIONS,
      JSON.stringify(sessions),
    );
  } catch {
    // ignore write errors for now
  }
}

export function getStartedApplicants(jobId: string): CandidateSession[] {
  const submittedEmails = new Set(
    getSubmissionsByJob(jobId).map((submission) =>
      normalizeEmail(submission.candidateEmail),
    ),
  );

  return getCandidateSessionsByJob(jobId).filter(
    (session) => !submittedEmails.has(normalizeEmail(session.candidateEmail)),
  );
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
  localStorage.removeItem(STORAGE_KEYS.CANDIDATE_SESSIONS);
}
