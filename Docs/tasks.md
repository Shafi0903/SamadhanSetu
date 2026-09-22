# SamadhanSetu - Development Task Breakdown

This document divides the SamadhanSetu platform development into manageable phases and actionable tasks, prioritizing the Minimum Viable Product (MVP) based on the PRD.

## Phase 1: Project Setup & Architecture (Week 1)
**Goal:** Establish the foundational codebase, database schemas, and design system.

* [x] **Task 1.1: Initialize Monorepo**
  * Set up the project structure (Frontend: Next.js, Backend: Node/Express).
  * Configure TypeScript, ESLint, and Prettier according to `Rules.md`.
* [x] **Task 1.2: Database Setup & Schema Design**
  * Set up PostgreSQL database configuration & Prisma client.
  * Define Prisma schemas for `User`, `Role`, `Problem`, `Solution`, `Comment`, `SupportPledge`, and `TimelineEvent`.
* [x] **Task 1.3: Design System Implementation**
  * Configure Tailwind CSS with colors, fonts, and spacing defined in `design.md`.
  * Create base UI components (Button, Input, Card, Badge, Modal, Textarea, Select, Tabs).
* [x] **Task 1.4: CI/CD Pipeline**
  * Set up GitHub Actions for automated linting, type checking, and testing.

## Phase 2: Authentication & User Management (Week 2)
**Goal:** Securely onboard the four primary user personas.

* [x] **Task 2.1: Auth Service Setup**
  * Implement JWT signing and verification, bcrypt password hashing, and Zod input validation schemas.
* [x] **Task 2.2: Citizen Authentication**
  * Build OTP-based mobile login flow for citizens (send OTP, verify OTP, auto-registration).
* [x] **Task 2.3: Institutional Authentication**
  * Build standard email/password registration for Government, University, and Industry roles.
  * Implement an admin approval workflow for institutional accounts.
* [x] **Task 2.4: Role-Based Access Control (RBAC)**
  * Create middlewares to authenticate JWT tokens and restrict access by UserRole (`CITIZEN`, `GOVERNMENT`, `UNIVERSITY`, `INDUSTRY`).
  * Add dedicated role-based dashboards (`/dashboard/citizen`, `/dashboard/government`, `/dashboard/university`, `/dashboard/industry`).

## Phase 3: Core Problem Lifecycle (Week 3)
**Goal:** Allow citizens to submit problems and government officials to verify them.

* [x] **Task 3.1: Problem Submission Form (Citizen)**
  * Build the multi-step form (Title, Category, Description, Geo-location/GPS Detection, Media Upload).
  * Implement Zod payload validation on backend.
* [x] **Task 3.2: Citizen Dashboard**
  * Create a UI for citizens to track their submitted tickets and view statuses.
* [x] **Task 3.3: Government Triage Dashboard**
  * Build a queue system for nodal officers to view incoming submissions.
  * Implement filtering (by location, date, category).
* [x] **Task 3.4: Verification Flow**
  * Add functionality for government admins to "Approve/Verify" or "Reject" problems with reasons.
  * Create public Challenge Board and 5-stage Setu problem lifecycle audit tracker.

## Phase 4: Matchmaking & Collaboration (Week 4)
**Goal:** Enable universities to claim verified problems and industry to offer support.

* [x] **Task 4.1: Public Challenge Board**
  * Build a searchable, filterable grid/list view of all *Verified* problems with claim status indicators.
* [x] **Task 4.2: Project Claiming (University)**
  * Implement the workflow for a Faculty member to "Claim" a problem.
  * Create the "Solution Proposal" submission portal for student teams (prototype stages, code repo, document attachments).
* [x] **Task 4.3: Industry Support Portal**
  * Build the UI for Industry partners to browse proposed solutions across universities.
  * Implement the "Pledge Support" feature (CSR financial funding, technical mentorship, testing equipment, incubation).
  * Add solution resolution trigger advancing problems to deployed & resolved status.

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