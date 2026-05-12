"use client";

import { useRouter } from "next/navigation";
import { jobs } from "@/data/jobs";
import styles from "./page.module.css";
import { useState } from "react";
import CreateScreeningModal from "@/components/recruiter/CreateScreeningModal/CreateScreeningModal";

export default function JobsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button onClick={() => setIsModalOpen(true)}>
        Create Phone Screening
      </button>

      <h1 className={styles.title}>Available Jobs</h1>

      <div className={styles.grid}>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={styles.card}
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <h2 className={styles.jobTitle}>{job.title}</h2>

            <p className={styles.meta}>
              {job.location} · {job.employmentType}
            </p>

            <p className={styles.desc}>{job.description}</p>

            <button
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/jobs/${job.id}`);
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      <CreateScreeningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
