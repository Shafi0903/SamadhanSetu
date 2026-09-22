# AI Development Guidelines & Core Rules

This document outlines the core principles, coding standards, and project structure rules that AI coding assistants must follow when generating, refactoring, or reviewing code for the **SamadhanSetu** platform.

## 1. General AI Behavior & Principles

* **Think Step-by-Step:** Always break down complex requests into logical steps before writing code.

* **Be Concise:** Avoid unnecessary boilerplate. Write clean, efficient, and self-documenting code.

* **Fail Fast, Ask Early:** If a requirement is ambiguous, state the assumptions clearly or ask the user for clarification before proceeding with massive code generation.

* **Security First:** Never hardcode secrets, API keys, or sensitive data. Always assume environment variables (`process.env`). Sanitze all user inputs.

* **DRY & YAGNI:** Do not repeat yourself. Do not implement features that haven't been explicitly requested (You Aren't Gonna Need It).

## 2. Technology Stack Preferences

Assume the following technology stack unless explicitly instructed otherwise:

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS.

* **Backend:** Node.js, Express (or NestJS), TypeScript.

* **Database:** PostgreSQL (with Prisma ORM or Drizzle).

* **State Management:** Zustand or React Context API.

* **Testing:** Jest and React Testing Library.

## 3. Coding Standards

### TypeScript & Types

* Strictly enforce TypeScript. Avoid using `any`; use `unknown` if the type is truly dynamic, or define proper interfaces/types.

* Group shared types and interfaces in a dedicated `types` or `interfaces` directory.

### React / Frontend

* Use Functional Components with React Hooks. Do not use Class Components.

* Extract reusable logic into Custom Hooks.

* Keep components small and focused on a single responsibility.

* Use Tailwind CSS for all styling. Avoid inline styles unless computing dynamic values.

* Implement accessible HTML (a11y) by default (e.g., `aria-labels`, proper semantic tags).

### Backend & API

* Follow RESTful API design principles (or GraphQL if specified).

* Use HTTP status codes correctly (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error).

* Implement robust error handling. Wrap async route handlers in try-catch blocks or use a centralized error-handling middleware.

* Validate all incoming payload data (e.g., using Zod or Joi).

### Naming Conventions

* **Variables & Functions:** `camelCase` (e.g., `handleUserSubmit`, `isAuthenticated`).

* **Components & Interfaces:** `PascalCase` (e.g., `ChallengeCard`, `UserProfile`).

* **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`).

* **File Names (React Components):** `PascalCase.tsx` (e.g., `Button.tsx`).

* **File Names (Utilities/Hooks):** `camelCase.ts` (e.g., `useFetchData.ts`, `formatDate.ts`).

## 4. Project Structure Guidelines

Enforce a clean, feature-based or domain-based folder structure.

**Typical Monorepo / Full-Stack Structure:**

```
/
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable UI components (buttons, modals)
│   │   ├── features/       # Domain-specific components (challenges, users)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Third-party library configurations (Axios, etc.)
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Helper functions
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Express middlewares (auth, error handling)
│   │   ├── models/         # Database schemas/models
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   └── utils/          # Helper functions
└── shared/                 # Types and constants shared across FE and BE

```

## 5. Version Control & Commits

* (If writing commit messages) Follow the Conventional Commits specification: `type(scope): description`.

* Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.