# SamadhanSetu - Development Task Breakdown

This document divides the SamadhanSetu platform development into manageable phases and actionable tasks, prioritizing the Minimum Viable Product (MVP) based on the PRD.

## Phase 1: Project Setup & Architecture (Week 1)
**Goal:** Establish the foundational codebase, database schemas, and design system.

* [x] **Task 1.1: Initialize Monorepo**
  * Set up the project structure (Frontend: Next.js, Backend: Node/Express).
  * Configure TypeScript, ESLint, and Prettier according to `Rules.md`.
* [ ] **Task 1.2: Database Setup & Schema Design**
  * Set up PostgreSQL database.
  * Define Prisma/Drizzle schemas for `User`, `Role`, `Problem`, `Solution`, and `Comment`.
* [ ] **Task 1.3: Design System Implementation**
  * Configure Tailwind CSS with colors, fonts, and spacing defined in `design.md`.
  * Create base UI components (Button, Input, Card, Badge, Modal).
* [ ] **Task 1.4: CI/CD Pipeline**
  * Set up GitHub Actions for automated linting, type checking, and testing.

## Phase 2: Authentication & User Management (Week 2)
**Goal:** Securely onboard the four primary user personas.

* [ ] **Task 2.1: Auth Service Setup**
  * Implement NextAuth or an alternative (e.g., Supabase/Clerk) for session management.
* [ ] **Task 2.2: Citizen Authentication**
  * Build OTP-based mobile/email login flow for basic users.
* [ ] **Task 2.3: Institutional Authentication**
  * Build standard email/password registration for Government, University, and Industry roles.
  * Implement an admin approval workflow for institutional accounts.
* [ ] **Task 2.4: Role-Based Access Control (RBAC)**
  * Create middleware to protect routes based on user roles.

## Phase 3: Core Problem Lifecycle (Week 3)
**Goal:** Allow citizens to submit problems and government officials to verify them.

* [ ] **Task 3.1: Problem Submission Form (Citizen)**
  * Build the multi-step form (Title, Category, Description, Geo-location/Map Pin, Image Upload).
  * Implement form validation.
* [ ] **Task 3.2: Citizen Dashboard**
  * Create a UI for citizens to track their submitted tickets and view statuses.
* [ ] **Task 3.3: Government Triage Dashboard**
  * Build a queue system for nodal officers to view incoming submissions.
  * Implement filtering (by location, date, category).
* [ ] **Task 3.4: Verification Flow**
  * Add functionality for government admins to "Approve/Verify", "Reject", or "Merge Duplicate" problems.

## Phase 4: Matchmaking & Collaboration (Week 4)
**Goal:** Enable universities to claim verified problems and industry to offer support.

* [ ] **Task 4.1: Public Challenge Board**
  * Build a searchable, filterable grid/list view of all *Verified* problems.
* [ ] **Task 4.2: Project Claiming (University)**
  * Implement the workflow for a Faculty member to "Claim" a problem.
  * Create the "Solution Proposal" submission portal for student teams.
* [ ] **Task 4.3: Industry Support Portal**
  * Build the UI for Industry partners to browse proposed solutions.
  * Implement the "Pledge Support" feature (financial, mentorship, tech).

## Phase 5: Tracking & Notifications (Week 5)
**Goal:** Ensure transparency and keep all stakeholders informed.

* [ ] **Task 5.1: The "Setu" Timeline**
  * Develop the visual lifecycle tracker component for individual problem pages (Reported -> Verified -> Claimed -> Supported -> Resolved).
* [ ] **Task 5.2: Notification System**
  * Implement in-app notifications for status changes.
  * (Optional MVP) Set up email/SMS triggers for critical updates (e.g., citizen notified when issue is resolved).
* [ ] **Task 5.3: Global Analytics Dashboard**
  * Create a public-facing page showing top-level metrics (Problems solved, Active universities, Total CSR pledged).

## Phase 6: Testing, Polish & Deployment (Week 6)
**Goal:** Ensure a bug-free, accessible, and smooth user experience before pilot launch.

* [ ] **Task 6.1: Localization (i18n) Setup**
  * Implement multi-language support (English + 1 Local Language) for the citizen-facing app.
* [ ] **Task 6.2: End-to-End (E2E) Testing**
  * Write Cypress or Playwright tests for the critical user journeys (submission, verification, claiming).
* [ ] **Task 6.3: Responsive Design Audit**
  * Ensure all dashboards and forms work flawlessly on mobile and tablet devices.
* [ ] **Task 6.4: Production Deployment**
  * Deploy database, backend APIs, and frontend to production servers (e.g., Vercel, AWS, or Render).