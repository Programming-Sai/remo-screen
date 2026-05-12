const questionBank: Record<string, string[]> = {
  "job-001": [
    "Tell us about your frontend experience.",
    "How do you structure reusable UI components?",
    "How do you handle API errors in the frontend?",
    "Describe a difficult bug you solved recently.",
    "How do you optimize performance in React apps?",
  ],

  "job-002": [
    "Describe your backend development experience.",
    "How do you design REST APIs?",
    "What is JWT authentication?",
    "How do you debug production issues?",
    "How do you structure scalable services?",
  ],

  default: [
    "Tell us about yourself.",
    "Why are you interested in this role?",
    "Describe a project you are proud of.",
    "How do you handle challenges in a team?",
    "What technologies are you strongest with?",
  ],
};

export function generateQuestions(jobId: string): string[] {
  return questionBank[jobId] || questionBank.default;
}
