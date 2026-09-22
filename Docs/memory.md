# AI Project Memory & Context

**Purpose:** This document serves as the active memory and context tracker for AI assistants working on the SamadhanSetu platform. Whenever a significant decision is made, a complex bug is fixed, or a major milestone is reached, the AI must update this document to maintain context across sessions.

---

## 1. Current Project State & Active Context

* **Current Phase:** Phase 2 (Authentication & User Management)
* **Active Task:** Starting Task 2.1 (Auth Service Setup) and Task 2.2 / 2.3 (Citizen Mobile/OTP and Institutional Email/Password Auth with RBAC).
* **Immediate Next Step:** Implement authentication controllers, JWT signing, password hashing (bcrypt), and role validation middleware in `apps/backend`.

## 2. Important Decisions (Architecture & Design)

*Log all major technical, structural, or design decisions here along with the rationale.*

* **[2026-09-22] Design System UI Library:** Created a core component library in `apps/frontend/src/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Modal`, `Textarea`, `Select`, `Tabs`) adhering strictly to the color palettes, 8-pt grid, and accessibility standards from `design.md`.
* **[2026-09-22] CI/CD Pipeline:** Configured GitHub Actions workflow (`.github/workflows/ci.yml`) performing automated checkout, dependency caching, Prisma generation, backend type checking, and frontend Next.js production builds.
* **[2026-09-22] Prisma Database Schema:** Defined comprehensive Prisma schema (`apps/backend/prisma/schema.prisma`) modeling `User` (multi-persona with role-based attributes and verification flags), `Problem` (GPS geolocation coordinates, categories, status lifecycle, verification/claiming relations), `SolutionProposal` (student team prototype tracking), `SupportPledge` (industry CSR, mentorship, micro-grants), `Comment` (cross-entity discussion thread), `ProblemUpvote` (citizen validation), and `TimelineEvent` (audit log powering the transparent "Setu" lifecycle tracker).
* **[2026-09-22] Monorepo Structure:** Adopted NPM workspaces monorepo structure containing `apps/frontend` (Next.js 16, React 19, Tailwind CSS), `apps/backend` (Node.js/Express, TypeScript), and `packages/types` (shared domain models & TypeScript definitions).
* **[2026-09-22] Design System Tokens:** Applied the design tokens defined in `design.md` directly into `apps/frontend/tailwind.config.ts` and `apps/frontend/src/app/globals.css`, including semantic status colors (submitted: blue-500, pending: amber-500, urgent: red-500, resolved: emerald-500) and brand colors (primary: indigo-600, secondary: emerald-500).
* **[2026-09-22] Core Shared Types:** Initialized `@samadhansetu/types` to unify data contracts (`UserRole`, `ProblemStatus`, `ProblemCategory`, `Problem`, `SolutionProposal`, `SupportPledge`, `ApiResponse`) between frontend and backend.
* **[YYYY-MM-DD] ORM Choice:** Selected Prisma as the ORM for PostgreSQL due to its superior TypeScript integration and developer experience compared to standard TypeORM.
* **[YYYY-MM-DD] Auth Strategy:** Chose JWT (JSON Web Tokens) over session cookies for the initial MVP to easily support both web and potential future mobile app clients (like a React Native citizen app).

## 3. Known Bugs, Quirks & Workarounds

*Log issues that are currently present, frequently recurring, or specific workarounds the AI needs to remember when writing code.*

* **Prisma & @prisma/client Version Alignment:** Ensure `@prisma/client` and `prisma` CLI share identical major and minor version numbers (e.g., 6.19.3) in the monorepo root and workspace to prevent missing query engine runtime module errors.

## 4. Completed Milestones & Changelog

*Briefly summarize completed tasks so the AI knows what already exists.*

* **[2026-09-22] Phase 1 Fully Complete:**
  - Task 1.1: Monorepo established (Next.js 16 App Router, Express, `@samadhansetu/types`).
  - Task 1.2: PostgreSQL Prisma schema designed and compiled; client singleton created.
  - Task 1.3: Design tokens applied; 8 accessible UI components created (`Button`, `Card`, `Badge`, `Input`, `Modal`, `Textarea`, `Select`, `Tabs`).
  - Task 1.4: GitHub Actions CI/CD workflow created and validated.
* **[YYYY-MM-DD] Documentation:** Created initial PRD (`PRD.md`), AI Rules (`rules.md`), Design System (`design.md`), Task Breakdown (`tasks.md`), and Architecture blueprint (`architecture.md`).
* **[YYYY-MM-DD] Documentation:** Created initial PRD (`PRD.md`), AI Rules (`rules.md`), Design System (`design.md`), Task Breakdown (`tasks.md`), and Architecture blueprint (`architecture.md`).

## 5. Development Directives & AI Reminders

*Specific instructions for the AI based on user preferences or project discoveries.*

* **Always Check Role Permissions:** When generating backend routes, always ensure the appropriate Role-Based Access Control (RBAC) middleware is applied (e.g., only `GOVERNMENT` can change status to `VERIFIED`).
* **Tailwind Consistency:** Strictly adhere to the color palette defined in `design.md`. Do not invent new hex codes.
* **Database Updates:** If a new feature requires a database change, always update the Prisma schema first and note it in the "Important Decisions" section.

---
*Note to AI: Before starting a new task, read this document. After finishing a complex task, append relevant details to the sections above.*