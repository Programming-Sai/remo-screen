export type ResponseType = "text" | "audio";

export interface Job {
  id: string;
  title: string;
  location: string;
  employmentType: string;
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
  questions: Question[];
  allowBack?: boolean;
  responseMode?: "text" | "audio" | "demo";
}

export interface Answer {
  questionId: string;
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
