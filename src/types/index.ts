export type EmploymentType = "Full-time" | "Part-time" | "Internship" | "NSS";

export type ResponseType = "text" | "audio";

export interface Job {
  id: string;
  title: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  responseType: ResponseType;
  isCustom: boolean;
}

export interface Screening {
  id: string;
  jobId: string;
  createdAt: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  responseType: ResponseType;
  value: string;
}

export interface Submission {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  answers: Answer[];
  submittedAt: string;
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendation: "advance" | "reject" | "hold";
}

export interface CandidateSession {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  questionIndex: number;
  questionCount: number;
  answers: Record<string, string>;
  startedAt: string;
  updatedAt: string;
}
