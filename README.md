# SamadhanSetu (समाधान सेतु)

> Digital Civic-Tech Platform Bridging Grassroots Societal Challenges with University Innovation and Industry CSR.

## Project Structure (Monorepo)

```text
SamadhanSetu/
├── apps/
│   ├── frontend/         # Next.js 16 (App Router), React 19, Tailwind CSS v4
│   └── backend/          # Node.js, Express, TypeScript, Prisma ORM
├── packages/
│   └── types/            # Shared TypeScript domain models & interfaces
├── Docs/                 # Project documentation (PRD, Architecture, Design, Rules, Tasks, Memory)
├── package.json          # Root Monorepo configuration (NPM Workspaces)
└── README.md
```

## Stakeholder Ecosystem

1. **Citizens (The Reporters):** Report civic grievances with GPS location & media.
2. **Government Authorities (The Verifiers):** Triage, deduplicate, and verify problems onto the Challenge Board.
3. **Universities (The Solvers):** Faculty and students claim verified challenges for capstones and prototypes.
4. **Industry Partners (The Enablers):** CSR sponsorship, equipment, and expert mentorship.

## Getting Started

### Prerequisites
- Node.js >= 20.x
- PostgreSQL >= 15.x

### Installation
```bash
# Install dependencies across all workspaces
npm install
```

### Running Frontend
```bash
npm run dev:frontend
# App accessible at http://localhost:3000
```

### Running Backend
```bash
npm run dev:backend
# API accessible at http://localhost:5000
```
