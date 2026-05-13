/**
 * Format a timestamp into relative time (e.g., "2 hours ago", "3 days ago", "just now")
 */
export function formatRelativeTime(date: Date | string): string {
  const timestamp = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - timestamp.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
}

/**
 * Get the most recent submission date for a job (returns Date or null)
 */
export function getLastSubmissionDate(
  submissions: { submittedAt: string | Date }[],
): Date | null {
  if (submissions.length === 0) return null;

  const dates = submissions
    .map((s) => new Date(s.submittedAt))
    .filter((d) => !isNaN(d.getTime()));

  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

/**
 * Format last activity text for a job
 */
export function getLastActivityText(
  submissions: { submittedAt: string | Date }[],
): string {
  const lastDate = getLastSubmissionDate(submissions);
  if (!lastDate) return "No activity yet";
  return `Last activity ${formatRelativeTime(lastDate)}`;
}
