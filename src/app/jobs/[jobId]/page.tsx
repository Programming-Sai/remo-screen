"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { jobs } from "@/data/jobs";
import CreateScreeningModal from "@/components/recruiter/CreateScreeningModal/CreateScreeningModal";
import { getScreeningByJobId, getSubmissionsByJob } from "@/lib/storage";

import styles from "./page.module.css";
import { Header } from "@/components/ui/Header/Header";
import { Icon } from "@/components/ui/Icon/Icon";

const ITEMS_PER_PAGE = 5;

export default function JobPage() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const jobId = params?.jobId as string;

  const job = useMemo(() => {
    return jobs.find((j) => j.id === jobId);
  }, [jobId]);

  const screening = getScreeningByJobId(jobId);
  const submissions = getSubmissionsByJob(jobId);

  const screeningLink = `${typeof window !== "undefined" ? window.location.origin : ""}/screening/${jobId}`;

  // Filter submissions by search term (name or email)
  const filteredSubmissions = useMemo(() => {
    if (!searchTerm.trim()) return submissions;
    const term = searchTerm.toLowerCase();
    return submissions.filter(
      (sub) =>
        sub.candidateName.toLowerCase().includes(term) ||
        sub.candidateEmail.toLowerCase().includes(term),
    );
  }, [submissions, searchTerm]);

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubmissions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubmissions, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (!job) return <p>Job not found</p>;

  return (
    <main className={styles.page}>
      <Header />

      <main className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link href="/jobs">Jobs</Link>
          <span>›</span>
          <span className={styles.breadcrumbCurrent}>{job.title}</span>
        </div>

        <div className={styles.heroGrid}>
          <section className={styles.jobCard}>
            <div className={styles.jobHeader}>
              <div>
                <h1 className={styles.title}>{job.title}</h1>

                <div className={styles.metaRow}>
                  <span>
                    <Icon name="location_on" opticalSize={20} /> {job.location}
                  </span>
                  <span>
                    <Icon name="work" opticalSize={20} /> {job.employmentType}
                  </span>
                  <span>
                    <Icon name="quiz" opticalSize={20} />
                    {screening ? "Screening created" : "No screening yet"}
                  </span>
                </div>
              </div>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => setIsModalOpen(true)}
              >
                <Icon name="add" />
                {screening ? "Edit Screening" : "Create Screening"}
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
                  value={screeningLink}
                />
                <button
                  className={styles.copyButton}
                  type="button"
                  onClick={() => navigator.clipboard.writeText(screeningLink)}
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

        <section className={styles.pipelineCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Applicant Pipeline</h2>
            <div className={styles.searchWrap}>
              <Icon name="search" opticalSize={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  className={styles.clearSearch}
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  <Icon name="close" opticalSize={20} />
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
                                .map((part) => part[0])
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    <Icon name="chevron_left" opticalSize={20} />
                  </button>
                  <span className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                  >
                    <Icon name="chevron_right" opticalSize={20} />
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
      </main>

      <CreateScreeningModal
        isOpen={isModalOpen}
        jobId={jobId}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
