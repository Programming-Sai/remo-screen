# RemoScreen

A UI-only Next.js phone screening platform for recruiters and candidates.

## Overview

This project is a frontend take-home implementation of a two-sided screening flow:

- Recruiters can browse jobs, create screening questions, review applicants, and open mocked analysis.
- Candidates can open a public screening link, enter their details, answer questions one at a time, and submit responses.
- All data is stored in code or `localStorage`; there is no backend.

## Stack

- Next.js App Router
- TypeScript
- React functional components and hooks
- CSS Modules

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

- Jobs page with seeded roles, search, and clickable job cards
- Create phone screening modal with generated questions, edit-in-place behavior, remove controls, response type switching, and question reordering
- Job detail page with public screening link and applicant list
- Applicant detail page with mocked AI analysis
- Candidate screening flow with name/email collection, one-question-at-a-time progression, validation, and completion state
- Persistent submissions and screenings in `localStorage`
- Loading skeletons for the main pages

## Data Model

- Jobs are seeded from `src/data/jobs.ts`
- Screenings are stored in `localStorage` under `aihrly_screenings`
- Candidate submissions are stored in `localStorage` under `aihrly_submissions`

## Trade-offs

- No backend or database was added, per the assessment scope.
- Audio response support is mocked with placeholder UI instead of real recording/playback.
- Analysis is intentionally fake and deterministic rather than AI-driven.
- The create-screening flow supports basic reorder controls, but not drag-and-drop.

## Notes

- The root route redirects to `/jobs`.
- Candidate and recruiter pages are designed to work entirely client-side.
- The app is intentionally lightweight so the core assessment flow is easy to review.
