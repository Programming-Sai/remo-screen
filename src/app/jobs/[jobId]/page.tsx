"use client";

import { useParams, useRouter } from "next/navigation";
import { jobs } from "@/data/jobs";
import styles from "./page.module.css";
import { getScreeningByJobId, getSubmissionsByJob } from "@/lib/storage";
import CreateScreeningModal from "@/components/recruiter/CreateScreeningModal/CreateScreeningModal";
import { useState } from "react";

export default function JobPage() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobId = params?.jobId as string;

  const job = jobs.find((j) => j.id === jobId);

  const screening = getScreeningByJobId(jobId as string);
  const submissions = getSubmissionsByJob(jobId as string);

  if (!job) return <p>Job not found</p>;

  function copyLink() {
    const link = `${window.location.origin}/screening/${jobId}`;
    navigator.clipboard.writeText(link);
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => router.push("/jobs")}>
        ← Back
      </button>

      <h1 className={styles.title}>{job.title}</h1>

      <p className={styles.meta}>
        {job.location} · {job.employmentType}
      </p>

      <p className={styles.desc}>{job.description}</p>

      <div className={styles.actions}>
        {!screening ? (
          <button
            className={styles.primary}
            onClick={() => setIsModalOpen(true)}
          >
            Create Screening
          </button>
        ) : (
          <div>
            <p>Screening created ✔</p>

            <button className={styles.primary} onClick={copyLink}>
              Copy Candidate Link
            </button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3>Applicants</h3>

        {submissions.length === 0 ? (
          <p>No applicants yet</p>
        ) : (
          submissions.map((s) => (
            <div key={s.id} className={styles.card}>
              <p>{s.candidateName}</p>
              <p>{s.candidateEmail}</p>

              <button
                onClick={() =>
                  router.push(`/jobs/${job.id}/applicants/${s.id}`)
                }
              >
                View Responses
              </button>
            </div>
          ))
        )}
      </div>
      <CreateScreeningModal
        isOpen={isModalOpen}
        jobId={jobId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
