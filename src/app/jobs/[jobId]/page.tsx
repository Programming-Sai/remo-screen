"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { jobs } from "@/data/jobs";
import CreateScreeningModal from "@/components/recruiter/CreateScreeningModal/CreateScreeningModal";
import { getScreeningByJobId, getSubmissionsByJob } from "@/lib/storage";

import styles from "./page.module.css";
import { Header } from "@/components/ui/Header/Header";

export default function JobPage() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobId = params?.jobId as string;

  const job = useMemo(() => {
    return jobs.find((j) => j.id === jobId);
  }, [jobId]);

  const screening = getScreeningByJobId(jobId);
  const submissions = getSubmissionsByJob(jobId);

  const screeningLink = `${typeof window !== "undefined" ? window.location.origin : ""}/screening/${jobId}`;

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
                  <span>{job.location}</span>
                  <span>{job.employmentType}</span>
                  <span>
                    {screening ? "Screening created" : "No screening yet"}
                  </span>
                </div>
              </div>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => setIsModalOpen(true)}
              >
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
                onClick={() => router.push(`/screening/${jobId}`)}
              >
                Open Candidate View
              </button>
            </section>

            <section className={styles.healthCard}>
              <p className={styles.healthLabel}>Job Health</p>
              <div className={styles.healthRow}>
                <span className={styles.healthValue}>{submissions.length}</span>
                <span className={styles.healthText}>Active Applicants</span>
              </div>

              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.min(100, submissions.length * 25)}%`,
                  }}
                />
              </div>

              <p className={styles.healthFooter}>
                {screening
                  ? `${screening.questions.length} screening questions ready`
                  : "Create a screening to start receiving applicants"}
              </p>
            </section>
          </aside>
        </div>

        <section className={styles.pipelineCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Applicant Pipeline</h2>

            <div className={styles.pipelineActions}>
              <button className={styles.filterButton} type="button">
                Filter
              </button>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No applicants yet</h3>
              <p>
                Once candidates submit the screening, they will appear here.
              </p>
            </div>
          ) : (
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
                  {submissions.map((submission) => (
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
                        {new Date(submission.submittedAt).toLocaleDateString()}
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
          )}

          <div className={styles.pipelineFooter}>
            <p>
              Showing {submissions.length} applicant
              {submissions.length === 1 ? "" : "s"}
            </p>
          </div>
        </section>
      </main>

      <button
        className={styles.fab}
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

      <CreateScreeningModal
        isOpen={isModalOpen}
        jobId={jobId}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
