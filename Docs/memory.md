# AI Project Memory & Context

**Purpose:** This document serves as the active memory and context tracker for AI assistants working on the SamadhanSetu platform. Whenever a significant decision is made, a complex bug is fixed, or a major milestone is reached, the AI must update this document to maintain context across sessions.

---

## 1. Current Project State & Active Context

* **Current Phase:** Phase 4 (Matchmaking & Collaboration)
* **Active Task:** Starting Task 4.1 (Public Challenge Board claiming integration), Task 4.2 (University Project Claiming & Solution Proposal submission), and Task 4.3 (Industry Support Pledging).
* **Immediate Next Step:** Implement Solution Proposal submission endpoints (`POST /api/solutions`), problem claiming endpoints (`PATCH /api/problems/:id/claim`), and Industry CSR pledging (`POST /api/pledges`).

## 2. Important Decisions (Architecture & Design)

*Log all major technical, structural, or design decisions here along with the rationale.*

* **[2026-09-22] 5-Stage Setu Transparent Lifecycle Tracker:** Attached `TimelineEvent` records to every state transition (*Reported -> Verified -> Claimed -> Supported -> Resolved*). Implemented dynamic status calculations and visual indicator bar on the public challenge page (`/challenge/[id]`).
* **[2026-09-22] Dual Authentication & RBAC:** Implemented JWT-based authentication supporting passwordless mobile OTP for `CITIZEN` users, and encrypted (bcrypt) credential registration for institutional personas (`GOVERNMENT`, `UNIVERSITY`, `INDUSTRY`). Added institutional vetting workflow where newly registered institutions default to `isVerified: false` until approved by a nodal government authority.
* **[2026-09-22] Client Auth Store:** Created Zustand auth store (`apps/frontend/src/store/authStore.ts`) with client persistence and automatic authorization header injection via `apiRequest` helper.
* **[2026-09-22] Design System UI Library:** Created a core component library in `apps/frontend/src/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Modal`, `Textarea`, `Select`, `Tabs`) adhering strictly to the color palettes, 8-pt grid, and accessibility standards from `design.md`.
* **[2026-09-22] CI/CD Pipeline:** Configured GitHub Actions workflow (`.github/workflows/ci.yml`) performing automated checkout, dependency caching, Prisma generation, backend type checking, and frontend Next.js production builds.
* **[2026-09-22] Prisma Database Schema:** Defined comprehensive Prisma schema (`apps/backend/prisma/schema.prisma`) modeling `User`, `Problem`, `SolutionProposal`, `SupportPledge`, `Comment`, `ProblemUpvote`, and `TimelineEvent`.
* **[2026-09-22] Monorepo Structure:** Adopted NPM workspaces monorepo structure containing `apps/frontend` (Next.js 16, React 19, Tailwind CSS), `apps/backend` (Node.js/Express, TypeScript), and `packages/types` (shared domain models & TypeScript definitions).
* **[2026-09-22] Design System Tokens:** Applied the design tokens defined in `design.md` directly into `apps/frontend/tailwind.config.ts` and `apps/frontend/src/app/globals.css`.
* **[2026-09-22] Core Shared Types:** Initialized `@samadhansetu/types` to unify data contracts (`UserRole`, `ProblemStatus`, `ProblemCategory`, `Problem`, `SolutionProposal`, `SupportPledge`, `ApiResponse`) between frontend and backend.

## 3. Known Bugs, Quirks & Workarounds

*Log issues that are currently present, frequently recurring, or specific workarounds the AI needs to remember when writing code.*

* **Express 5 Param Typing:** In Express 5, `req.params.id` is typed as `string | string[]`. Always guard with `Array.isArray(req.params.id) ? req.params.id[0] : req.params.id` before passing to Prisma query functions.
* **Prisma & @prisma/client Version Alignment:** Ensure `@prisma/client` and `prisma` CLI share identical major and minor version numbers (e.g., 6.19.3) in the monorepo root and workspace to prevent missing query engine runtime module errors.

## 4. Completed Milestones & Changelog

*Briefly summarize completed tasks so the AI knows what already exists.*

* **[2026-09-22] Phase 3 Complete:**
  - Built `ProblemService` and `ProblemController` managing problem creation, triage queries, and verification / rejection lifecycles.
  - Built multi-step Citizen Problem Submission form with GPS coordinate detection (`/dashboard/citizen/new`).
  - Updated Citizen Dashboard with live metrics and ticket cards (`/dashboard/citizen`).
  - Built Government Triage Console with filtering and official rejection dialog (`/dashboard/government`).
  - Built Public Challenge Board with search and categories (`/challenge`).
  - Built Setu Problem Detail page with visual 5-stage lifecycle tracker and upvoting (`/challenge/[id]`).
* **[2026-09-22] Phase 2 Complete:** JWT authentication, RBAC middleware, Citizen OTP, and institutional login/registration.
* **[2026-09-22] Phase 1 Fully Complete:** Monorepo setup, Prisma schemas, design system UI components, and GitHub Actions CI.
* **[YYYY-MM-DD] Documentation:** Created initial PRD (`PRD.md`), AI Rules (`rules.md`), Design System (`design.md`), Task Breakdown (`tasks.md`), and Architecture blueprint (`architecture.md`).
* **[YYYY-MM-DD] Documentation:** Created initial PRD (`PRD.md`), AI Rules (`rules.md`), Design System (`design.md`), Task Breakdown (`tasks.md`), and Architecture blueprint (`architecture.md`).

## 5. Development Directives & AI Reminders

*Specific instructions for the AI based on user preferences or project discoveries.*

* **Always Check Role Permissions:** When generating backend routes, always ensure the appropriate Role-Based Access Control (RBAC) middleware is applied (e.g., only `GOVERNMENT` can change status to `VERIFIED`).
* **Tailwind Consistency:** Strictly adhere to the color palette defined in `design.md`. Do not invent new hex codes.
* **Database Updates:** If a new feature requires a database change, always update the Prisma schema first and note it in the "Important Decisions" section.

---
*Note to AI: Before starting a new task, read this document. After finishing a complex task, append relevant details to the sections above.*