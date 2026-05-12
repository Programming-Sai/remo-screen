"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { jobs } from "@/data/jobs";
import CreateScreeningModal from "@/components/recruiter/CreateScreeningModal/CreateScreeningModal";
import { getScreeningsByJob, getSubmissionsByJob } from "@/lib/storage";

import styles from "./page.module.css";
import Link from "next/link";

export default function JobsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return jobs;

    return jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.employmentType.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const totalScreenings = jobs.reduce(
    (count, job) => count + getScreeningsByJob(job.id).length,
    0,
  );

  const totalApplicants = jobs.reduce(
    (count, job) => count + getSubmissionsByJob(job.id).length,
    0,
  );

  const featuredJob = filteredJobs[0];
  const secondaryJobs = filteredJobs.slice(1);

  return (
    <main className={styles.page}>
      <nav className={styles.topNav}>
        <div className={styles.brandBlock}>
          <div className={styles.brandMark}>RS</div>
          <div>
            <p className={styles.brandName}>Remo Screen</p>
            <p className={styles.brandSub}>Recruiter workspace</p>
          </div>
        </div>

        <div className={styles.navLinks}>
          <Link className={styles.navLinkActive} href="/jobs">
            Jobs
          </Link>
          <a className={styles.navLink} href="#">
            Talent
          </a>
          <a className={styles.navLink} href="#">
            Analytics
          </a>
        </div>

        <div className={styles.navActions}>
          <button className={styles.iconButton} type="button">
            Notifications
          </button>
          <button className={styles.iconButton} type="button">
            Settings
          </button>
          <div className={styles.avatar}>R</div>
        </div>
      </nav>

      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <h1 className={styles.title}>Active Job Listings</h1>
            <p className={styles.subtitle}>
              Manage open roles and coordinate screenings. Search jobs, review
              applicant activity, and create new screening flows.
            </p>
          </div>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            Create Phone Screening
          </button>
        </header>

        <section className={styles.searchBar}>
          <div className={styles.searchInputWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, locations, or type..."
            />
          </div>

          <button className={styles.secondaryButton} type="button">
            Filters
          </button>
        </section>

        {filteredJobs.length === 0 ? (
          <section className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No jobs found</h2>
            <p className={styles.emptyText}>
              Try a different search term or clear the search box.
            </p>
          </section>
        ) : (
          <>
            <section className={styles.grid}>
              {featuredJob && (
                <article
                  className={`${styles.card} ${styles.featuredCard}`}
                  onClick={() => router.push(`/jobs/${featuredJob.id}`)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.badgeRow}>
                      <span className={styles.badgePrimary}>Engineering</span>
                      <span className={styles.badgeSoft}>Urgent</span>
                    </div>

                    <button className={styles.moreButton} type="button">
                      More
                    </button>
                  </div>

                  <h2 className={styles.featuredTitle}>{featuredJob.title}</h2>

                  <div className={styles.metricsGrid}>
                    <div className={styles.metricBlock}>
                      <span className={styles.metricLabel}>Location</span>
                      <span className={styles.metricValue}>
                        {featuredJob.location}
                      </span>
                    </div>

                    <div className={styles.metricBlock}>
                      <span className={styles.metricLabel}>Type</span>
                      <span className={styles.metricValue}>
                        {featuredJob.employmentType}
                      </span>
                    </div>

                    <div className={styles.metricBlock}>
                      <span className={styles.metricLabel}>Screenings</span>
                      <span className={styles.metricValue}>
                        {getScreeningsByJob(featuredJob.id).length}
                      </span>
                    </div>

                    <div className={styles.metricBlock}>
                      <span className={styles.metricLabel}>Applicants</span>
                      <span className={styles.metricValue}>
                        {getSubmissionsByJob(featuredJob.id).length}
                      </span>
                    </div>
                  </div>

                  <p className={styles.cardDesc}>{featuredJob.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.avatarStack}>
                      <div className={styles.stackAvatar}>A</div>
                      <div className={styles.stackAvatar}>B</div>
                      <div className={styles.stackAvatar}>
                        +{totalApplicants}
                      </div>
                    </div>

                    <button className={styles.pipelineButton} type="button">
                      View Pipeline
                    </button>
                  </div>
                </article>
              )}

              {secondaryJobs.map((job) => (
                <article
                  key={job.id}
                  className={`${styles.card} ${styles.secondaryCard}`}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className={styles.cardTopCompact}>
                    <span className={styles.badgeSoft}>
                      {job.employmentType}
                    </span>
                    <button className={styles.moreButton} type="button">
                      More
                    </button>
                  </div>

                  <h3 className={styles.secondaryTitle}>{job.title}</h3>

                  <div className={styles.compactMeta}>
                    <div className={styles.compactLine}>
                      Location: {job.location}
                    </div>
                    <div className={styles.compactLine}>
                      Applicants: {getSubmissionsByJob(job.id).length}
                    </div>
                  </div>

                  <div className={styles.secondaryFooter}>
                    <span className={styles.updatedText}>
                      Screenings: {getScreeningsByJob(job.id).length}
                    </span>

                    <button className={styles.roundButton} type="button">
                      →
                    </button>
                  </div>
                </article>
              ))}

              <section className={`${styles.analyticsCard} ${styles.card}`}>
                <div className={styles.analyticsCopy}>
                  <h2 className={styles.analyticsTitle}>
                    Screening efficiency is up 24%
                  </h2>
                  <p className={styles.analyticsText}>
                    Your screening workflow is now tracking {totalScreenings}{" "}
                    screenings and {totalApplicants} total applicant
                    submissions.
                  </p>

                  <button className={styles.lightButton} type="button">
                    View Analytics Report
                  </button>
                </div>

                <div className={styles.chart}>
                  <div className={styles.barLow} />
                  <div className={styles.barMid} />
                  <div className={styles.barHigh} />
                  <div className={styles.barMax} />
                </div>
              </section>
            </section>

            <div className={styles.moreWrap}>
              <button className={styles.moreListingsButton} type="button">
                Show more active listings
              </button>
            </div>
          </>
        )}
      </section>

      <nav className={styles.bottomNav}>
        <div className={styles.bottomActive}>Jobs</div>
        <div className={styles.bottomItem}>Talent</div>
        <div className={styles.bottomItem}>Analytics</div>
      </nav>

      <CreateScreeningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
