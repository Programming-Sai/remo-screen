"use client";

import { useEffect } from "react";

import { jobs } from "@/data/jobs";
import { seedJobs } from "@/lib/storage";

export function AppBootstrap() {
  useEffect(() => {
    seedJobs(jobs);
  }, []);

  return null;
}
