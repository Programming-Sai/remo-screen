# RemoScreen

A UI-only Next.js phone screening platform for recruiters and candidates.

## Overview

This project is a frontend take-home implementation of a two-sided screening flow:

- Recruiters can browse jobs, create screening questions, review applicants, and open mocked analysis.
- Candidates can open a public screening link, enter their details, answer questions one at a time, and submit responses.
- Jobs, screenings, submissions, analyses, and in-progress candidate sessions are stored in code or `localStorage`; there is no backend.

## Stack

- Next.js App Router
- TypeScript
- React functional components and hooks
- CSS Modules
- `localStorage` for persisted recruiter and candidate state

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Useful scripts

```bash
npm run lint
npm run build
```

## What Is Included

- Jobs page with seeded roles, search, infinite scroll, and clickable job cards
- Create phone screening modal with:
  - generated questions
  - edit-toggle question fields
  - remove controls
  - response type switching
  - drag-and-drop reordering
  - custom questions
- Job detail page with:
  - public screening link
  - started applicant sessions
  - submitted applicant pipeline
- Applicant detail page with:
  - question and answer review
  - mocked AI analysis
  - cached analysis regeneration
- Candidate screening flow with:
  - name/email collection
  - one-question-at-a-time progression
  - validation
  - draft session persistence
  - completion state
- Loading skeletons for the main routes
- Branded missing-data states and a custom app-wide 404

## Data Model

- Jobs are seeded from `src/data/jobs.ts`
- Screenings are stored in `localStorage` under `aihrly_screenings`
- Candidate submissions are stored in `localStorage` under `aihrly_submissions`
- In-progress candidate sessions are stored in `localStorage` under `aihrly_candidate_sessions`
- Analysis results are stored in `localStorage` under `aihrly_analyses`

## Trade-offs

- No backend or database was added, per the assessment scope.
- Audio response support is mocked with placeholder UI instead of real recording/playback.
- Analysis is intentionally fake and deterministic rather than AI-driven.
- The app only tracks started sessions per browser/local storage state; there is no invitation system for separate "not started" candidate records.

## Notes

- The root route redirects to `/jobs`.
- Candidate and recruiter pages are designed to work entirely client-side where browser storage is required.
- The app uses branded not-found states for missing jobs, applicants, and screenings, plus a custom 404 page for invalid routes.
