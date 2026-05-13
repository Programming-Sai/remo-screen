"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { jobs } from "@/data/jobs";
import CreateScreeningModal from "@/components/recruiter/CreateScreeningModal/CreateScreeningModal";
import {
  getScreeningsByJob,
  getStartedApplicants,
  getSubmissionsByJob,
} from "@/lib/storage";
import { useToast } from "@/contexts/ToastContext";

import styles from "./page.module.css";
import { Header } from "@/components/ui/Header/Header";
import { Icon } from "@/components/ui/Icon/Icon";
import NotFoundState from "@/components/ui/NotFoundState/NotFoundState";

const ITEMS_PER_PAGE = 5;

export default function JobPage() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  const jobId = params?.jobId as string;

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobId]);
  const screenings = getScreeningsByJob(jobId);
  const screening = screenings[0];
  const submissions = getSubmissionsByJob(jobId);
  const startedApplicants = getStartedApplicants(jobId);
  const screeningPath = `/screening/${jobId}`;

  const filteredSubmissions = useMemo(() => {
    if (!searchTerm.trim()) return submissions;

    const term = searchTerm.toLowerCase();
    return submissions.filter(
      (sub) =>
        sub.candidateName.toLowerCase().includes(term) ||
        sub.candidateEmail.toLowerCase().includes(term),
    );
  }, [submissions, searchTerm]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubmissions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubmissions, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}${screeningPath}`);
    showToast({
      type: "success",
      title: "Link copied",
      message: "Share this link with candidates.",
    });
  };

  if (!job) {
    return (
      <main className={styles.page}>
        <Header />

        <div className={styles.content}>
          <NotFoundState
            eyebrow="Missing job"
            icon="work_off"
            title="This job could not be found"
            description="The job may have been removed, or the link might be stale."
            bullets={[
              "Go back to the jobs page and open another opening.",
              "If you expected to see this job, refresh after checking the seed data.",
            ]}
            primaryAction={{
              label: "Back to Jobs",
              href: "/jobs",
              icon: "arrow_back",
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Header />

      <div className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link href="/jobs">Jobs</Link>
          <span>&gt;</span>
          <span className={styles.breadcrumbCurrent}>{job.title}</span>
        </div>

        <div className={styles.heroGrid}>
          <section className={styles.jobCard}>
            <div className={styles.jobHeader}>
              <div>
                <h1 className={styles.title}>{job.title}</h1>

                <div className={styles.metaRow}>
                  <span>
                    <Icon name="location_on" size={16} /> {job.location}
                  </span>
                  <span>
                    <Icon name="work" size={16} /> {job.employmentType}
                  </span>
                  <span>
                    <Icon name="quiz" size={16} />
                    {screening
                      ? `Screening created${screenings.length > 1 ? ` (${screenings.length})` : ""}`
                      : "No screening yet"}
                  </span>
                  <span>
                    <Icon name="schedule" size={16} />
                    {startedApplicants.length} started
                  </span>
                  <span>
                    <Icon name="task_alt" size={16} />
                    {submissions.length} submitted
                  </span>
                </div>
              </div>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => setIsModalOpen(true)}
              >
                <Icon name="add" />
                {screening ? "Create Another Screening" : "Create Screening"}
              </button>
            </div>

            <p className={styles.desc}>{job.description}</p>
          </section>

          <aside className={styles.sideStack}>
            <section className={styles.linkCard}>
              <h2 className={styles.cardTitle}>Public Screening Link</h2>
              <p className={styles.cardText}>
                Share this link with candidates to start the screening.
              </p>

              <div className={styles.linkRow}>
                <input
                  className={styles.linkInput}
                  readOnly
                  value={screeningPath}
                />
                <button
                  className={styles.copyButton}
                  type="button"
                  onClick={handleCopy}
                >
                  Copy
                </button>
              </div>

              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => window.open(`/screening/${jobId}`, "_blank")}
              >
                Open Candidate View
              </button>
            </section>
          </aside>
        </div>

        <section className={styles.statusGrid}>
          <article className={styles.statusCard}>
            <span className={styles.statusLabel}>In Progress</span>
            <strong className={styles.statusValue}>
              {startedApplicants.length}
            </strong>
            <p className={styles.statusText}>
              Candidates who have opened the screening but not submitted yet.
            </p>
          </article>

          <article className={styles.statusCard}>
            <span className={styles.statusLabel}>Submitted</span>
            <strong className={styles.statusValue}>{submissions.length}</strong>
            <p className={styles.statusText}>
              Completed applications ready for recruiter review.
            </p>
          </article>
        </section>

        <section className={styles.startedCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>In Progress</h2>
            <span className={styles.sectionHint}>
              {startedApplicants.length} active session
              {startedApplicants.length === 1 ? "" : "s"}
            </span>
          </div>

          {startedApplicants.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No candidates currently in progress</h3>
              <p>
                Once a candidate opens the public link, their draft progress
                will appear here.
              </p>
            </div>
          ) : (
            <div className={styles.startedList}>
              {startedApplicants.map((applicant) => (
                <article key={applicant.id} className={styles.startedRow}>
                  <div className={styles.candidateCell}>
                    <div className={styles.candidateAvatar}>
                      {applicant.candidateName
                        .split(" ")
                        .slice(0, 2)
                        .map((part: string) => part.charAt(0))
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div>
                      <div className={styles.candidateName}>
                        {applicant.candidateName}
                      </div>
                      <div className={styles.candidateEmail}>
                        {applicant.candidateEmail}
                      </div>
                    </div>
                  </div>

                  <div className={styles.startedMeta}>
                    <span className={styles.statusChipStarted}>Started</span>
                    <span>
                      Question{" "}
                      {Math.min(
                        applicant.questionIndex + 1,
                        applicant.questionCount,
                      )}{" "}
                      of {applicant.questionCount}
                    </span>
                    <span>
                      Updated{" "}
                      {new Date(applicant.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.pipelineCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Applicant Pipeline</h2>
            <div className={styles.searchWrap}>
              <Icon name="search" size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  className={styles.clearSearch}
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>
                {searchTerm ? "No matching applicants" : "No applicants yet"}
              </h3>
              <p>
                {searchTerm
                  ? "Try a different name or email."
                  : "Once candidates submit the screening, they will appear here."}
              </p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Status</th>
                      <th>Applied</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td>
                          <div className={styles.candidateCell}>
                            <div className={styles.candidateAvatar}>
                              {submission.candidateName
                                .split(" ")
                                .slice(0, 2)
                                .map((part: string) => part.charAt(0))
                                .join("")
                                .toUpperCase()}
                            </div>

                            <div>
                              <div className={styles.candidateName}>
                                {submission.candidateName}
                              </div>
                              <div className={styles.candidateEmail}>
                                {submission.candidateEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.statusChip}>Submitted</span>
                        </td>
                        <td className={styles.appliedAt}>
                          {new Date(
                            submission.submittedAt,
                          ).toLocaleDateString()}
                        </td>
                        <td className={styles.actionsCell}>
                          <button
                            className={styles.responseButton}
                            type="button"
                            onClick={() =>
                              router.push(
                                `/jobs/${job.id}/applicants/${submission.id}`,
                              )
                            }
                          >
                            View Responses
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                    type="button"
                  >
                    <Icon name="chevron_left" size={16} />
                  </button>
                  <span className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                    type="button"
                  >
                    <Icon name="chevron_right" size={16} />
                  </button>
                </div>
              )}

              <div className={styles.pipelineFooter}>
                <p>
                  Showing {paginatedSubmissions.length} of{" "}
                  {filteredSubmissions.length} applicant
                  {filteredSubmissions.length === 1 ? "" : "s"}
                </p>
              </div>
            </>
          )}
        </section>
      </div>

      <CreateScreeningModal
        isOpen={isModalOpen}
        jobId={jobId}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
