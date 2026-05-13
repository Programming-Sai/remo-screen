"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { jobs } from "@/data/jobs";
import CreateScreeningModal from "@/components/recruiter/CreateScreeningModal/CreateScreeningModal";
import { getSubmissionsByJob } from "@/lib/storage";

import styles from "./page.module.css";
import { Header } from "@/components/ui/Header/Header";
import { Icon } from "@/components/ui/Icon/Icon";

const ITEMS_PER_PAGE = 9;

export default function JobsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false); // Add this

  const loaderRef = useRef<HTMLDivElement>(null);

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

  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, displayCount);
  }, [filteredJobs, displayCount]);

  const hasMore = displayCount < filteredJobs.length;

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setDisplayCount((prev) =>
              Math.min(prev + ITEMS_PER_PAGE, filteredJobs.length),
            );
            setIsLoading(false);
          }, 300);
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, filteredJobs.length]);

  // Back to top visibility - SIMPLE VERSION
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={styles.page}>
      <Header />

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
            <Icon name="add" />
            <p>Create Phone Screening</p>
          </button>
        </header>

        <section className={styles.searchBar}>
          <div className={styles.searchInputWrap}>
            <Icon name="search" />
            <input
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, locations, or type..."
            />
          </div>
        </section>

        {visibleJobs.length === 0 ? (
          <section className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No jobs found</h2>
            <p className={styles.emptyText}>
              Try a different search term or clear the search box.
            </p>
          </section>
        ) : (
          <>
            <section className={styles.grid}>
              {visibleJobs.map((job) => (
                <article
                  key={job.id}
                  className={`${styles.card} ${styles.secondaryCard}`}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className={styles.cardTopCompact}>
                    <span className={styles.badgeSoft}>
                      {job.employmentType}
                    </span>
                  </div>

                  <h3 className={styles.secondaryTitle}>{job.title}</h3>

                  <div className={styles.compactMeta}>
                    <div className={styles.compactLine}>
                      <Icon name="location_on" /> <p>{job.location}</p>
                    </div>
                    <div className={styles.compactLine}>
                      <Icon name="group" />
                      <p>{getSubmissionsByJob(job.id).length}</p>
                      Applicants
                    </div>
                  </div>

                  <div className={styles.secondaryFooter}>
                    <button className={styles.roundButton} type="button">
                      <Icon name="chevron_right" />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            {/* Infinite scroll loader */}
            {hasMore && (
              <div ref={loaderRef} className={styles.loaderWrap}>
                {isLoading ? (
                  <div className={styles.loader}>Loading more jobs...</div>
                ) : (
                  <div className={styles.loader}>Scroll for more</div>
                )}
              </div>
            )}

            {/* Show "all loaded" message */}
            {!hasMore && visibleJobs.length > 0 && (
              <div className={styles.allLoaded}>
                <Icon name="check_circle" opticalSize={20} />
                <p>All {filteredJobs.length} jobs loaded</p>
              </div>
            )}
          </>
        )}
      </section>

      <CreateScreeningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button onClick={scrollToTop} className={styles.backToTop}>
          <Icon name="arrow_upward" />
        </button>
      )}
    </main>
  );
}
