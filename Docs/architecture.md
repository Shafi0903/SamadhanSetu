# SamadhanSetu System Architecture

This document outlines the high-level architecture, core data flows, technology stack, and directory structure for the SamadhanSetu platform.

## 1. High-Level Architecture

SamadhanSetu follows a decoupled, client-server architectural pattern, utilizing a modern JavaScript/TypeScript stack. 

### Core Components
* **Client (Frontend):** A responsive Next.js web application serving all four primary user groups (Citizens, Government, Universities, Industry). It communicates with the backend via RESTful APIs.
* **API Gateway / Backend Service:** A Node.js & Express server handling business logic, authentication, and routing.
* **Relational Database:** A PostgreSQL database serving as the single source of truth for users, problems, solutions, and transactional data.
* **Blob Storage:** A cloud storage solution (e.g., AWS S3 or Cloudinary) for hosting media files uploaded by citizens (photos/videos of civic issues) and students (solution PDFs/diagrams).

## 2. Application Flow

The core application flow maps the lifecycle of a problem from submission to resolution across the four personas.

1. **Citizen Flow (Submission):**
   * Citizen logs in (OTP/Mobile).
   * Submits a Problem (Text + GPS Location + Media).
   * *System:* Saves media to Blob Storage, writes Problem record to DB with status `PENDING_VERIFICATION`.

2. **Government Flow (Verification):**
   * Nodal officer logs in and views the Triage Dashboard.
   * Officer reviews pending problems, deduplicates if necessary, and marks as `VERIFIED`.
   * *System:* Updates Problem status to `VERIFIED`, making it visible on the public Challenge Board. Citizen receives a notification.

3. **University Flow (Claim & Propose):**
   * Faculty/Student browses the Challenge Board.
   * Faculty claims a problem.
   * *System:* Updates Problem status to `UNDER_INVESTIGATION`.
   * Student team uploads a Solution Proposal (documents/links).
   * *System:* Associates the Solution with the Problem.

4. **Industry Flow (Sponsorship):**
   * Industry partner browses Solution Proposals.
   * Partner pledges resources (CSR Funds, Mentorship) to a specific Solution.
   * *System:* Logs the pledge.
   * Gov/University marks the implementation phase as `RESOLVED`.
   * *System:* Updates all timelines; final notifications sent to the original Citizen.

## 3. Technology Stack

Aligned with the core rules, the project utilizes the following technologies:

### Frontend
* **Framework:** Next.js (App Router)
* **Library:** React (with TypeScript)
* **Styling:** Tailwind CSS + Radix UI / Shadcn (for accessible components)
* **State Management:** Zustand (Global State) & React Query (Server State/Caching)
* **Form Handling:** React Hook Form + Zod (Validation)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js (with TypeScript)
* **ORM:** Prisma
* **Authentication:** JSON Web Tokens (JWT) / Passport.js (or NextAuth if heavily coupled with FE)
* **File Uploads:** Multer (Middleware) + AWS S3 SDK

### Database & Infrastructure
* **Database:** PostgreSQL
* **Hosting (Frontend):** Vercel
* **Hosting (Backend):** Render, Railway, or AWS EC2
* **Storage:** AWS S3 (Media & Documents)

## 4. Folder Structure (Monorepo)

The repository uses a monorepo setup (e.g., managed by Turborepo or NPM Workspaces) to share types and configurations between the frontend and backend.

```text
samadhansetu-monorepo/
│
├── apps/
│   ├── frontend/                 # Next.js Application
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router (Pages & Layouts)
│   │   │   │   ├── (auth)/       # Login/Register routes
│   │   │   │   ├── dashboard/    # Role-based dashboards
│   │   │   │   └── challenge/    # Public challenge board
│   │   │   ├── components/       # UI Components (Buttons, Cards, Modals)
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # API clients (Axios), Utils
│   │   │   └── store/            # Zustand state stores
│   │   ├── public/               # Static assets
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── backend/                  # Node.js / Express API
│       ├── src/
│       │   ├── controllers/      # Route handlers (auth, problems, solutions)
│       │   ├── middlewares/      # Auth checks, error handling, file upload
│       │   ├── routes/           # Express router definitions
│       │   ├── services/         # Core business logic
│       │   └── prisma/           # Database schema and migrations
│       │       └── schema.prisma 
│       ├── .env                  # Environment variables
│       └── package.json
│
├── packages/                     # Shared internal packages
│   ├── types/                    # Shared TypeScript interfaces (User, Problem)
│   ├── ui/                       # (Optional) Shared UI library
│   └── config/                   # Shared ESLint/Prettier configs
│
├── package.json                  # Root monorepo configuration
└── README.md
```