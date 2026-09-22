# AI Project Memory & Context

**Purpose:** This document serves as the active memory and context tracker for AI assistants working on the SamadhanSetu platform. Whenever a significant decision is made, a complex bug is fixed, or a major milestone is reached, the AI must update this document to maintain context across sessions.

---

## 1. Current Project State & Active Context

* **Current Phase:** Phase 1 (Project Setup & Architecture)
* **Active Task:** Completed Task 1.1 (Monorepo and Project Setup). Ready for Task 1.2 (Database Setup & Prisma Schema Design) and Task 1.3 (Base UI Component Library Expansion).
* **Immediate Next Step:** Define initial Prisma schema for `User`, `Role`, `Problem`, `Solution`, and `Comment` in `apps/backend/src/prisma/schema.prisma`.

## 2. Important Decisions (Architecture & Design)

*Log all major technical, structural, or design decisions here along with the rationale.*

* **[2026-09-22] Monorepo Structure:** Adopted NPM workspaces monorepo structure containing `apps/frontend` (Next.js 16, React 19, Tailwind CSS), `apps/backend` (Node.js/Express, TypeScript), and `packages/types` (shared domain models & TypeScript definitions).
* **[2026-09-22] Design System Tokens:** Applied the design tokens defined in `design.md` directly into `apps/frontend/tailwind.config.ts` and `apps/frontend/src/app/globals.css`, including semantic status colors (submitted: blue-500, pending: amber-500, urgent: red-500, resolved: emerald-500) and brand colors (primary: indigo-600, secondary: emerald-500).
* **[2026-09-22] Core Shared Types:** Initialized `@samadhansetu/types` to unify data contracts (`UserRole`, `ProblemStatus`, `ProblemCategory`, `Problem`, `SolutionProposal`, `SupportPledge`, `ApiResponse`) between frontend and backend.
* **[YYYY-MM-DD] ORM Choice:** Selected Prisma as the ORM for PostgreSQL due to its superior TypeScript integration and developer experience compared to standard TypeORM.
* **[YYYY-MM-DD] Auth Strategy:** Chose JWT (JSON Web Tokens) over session cookies for the initial MVP to easily support both web and potential future mobile app clients (like a React Native citizen app).

## 3. Known Bugs, Quirks & Workarounds

*Log issues that are currently present, frequently recurring, or specific workarounds the AI needs to remember when writing code.*

* **Empty State (Example):** No bugs logged yet.
* *(Template: [Bug Description] -> [Current Workaround / Fix Status])*

## 4. Completed Milestones & Changelog

*Briefly summarize completed tasks so the AI knows what already exists.*

* **[2026-09-22] Task 1.1 Complete:** Initialized Git repository, configured root NPM workspaces monorepo, scaffolded `apps/frontend` (Next.js App Router, Tailwind CSS, TypeScript), `apps/backend` (Express TypeScript), and `packages/types` (shared types). Created foundational UI components (`Button`, `Card`, `Badge`, `Input`) adhering to `design.md`. Both frontend and backend builds verified with exit code 0.
* **[YYYY-MM-DD] Documentation:** Created initial PRD (`PRD.md`), AI Rules (`rules.md`), Design System (`design.md`), Task Breakdown (`tasks.md`), and Architecture blueprint (`architecture.md`).

## 5. Development Directives & AI Reminders

*Specific instructions for the AI based on user preferences or project discoveries.*

* **Always Check Role Permissions:** When generating backend routes, always ensure the appropriate Role-Based Access Control (RBAC) middleware is applied (e.g., only `GOVERNMENT` can change status to `VERIFIED`).
* **Tailwind Consistency:** Strictly adhere to the color palette defined in `design.md`. Do not invent new hex codes.
* **Database Updates:** If a new feature requires a database change, always update the Prisma schema first and note it in the "Important Decisions" section.

---
*Note to AI: Before starting a new task, read this document. After finishing a complex task, append relevant details to the sections above.*