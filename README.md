# LeadFlow Client ⚡

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/TanStack_Query-5.56-FF4154.svg?logo=react-query)](https://tanstack.com/query/v5)

**LeadFlow Client** is the modern single-page frontend application for the **LeadFlow CRM** platform. Built with React 18, TypeScript, Vite, and Tailwind CSS, it delivers a lightning-fast, intuitive interface for managing client acquisition pipelines, sequence-driven follow-ups, and sales analytics.

---

## 🚀 Key Features

-  **Authentication & Session Management**: Secure user registration, login, JWT token persistence, and automatic 401 unauthorized session redirection.
-  **Real-Time Interactive Dashboard**: KPI counters for total leads, sales stage distribution, today's pending follow-ups, and overdue action items.
-  **Pipeline Lead Management**: Searchable, paginated lead tables with stage filtering (`NEW`, `CONTACTED`, `QUALIFIED`, `WON`, `LOST`) and quick stage switcher.
-  **Sequence-Driven Follow-Up Modal**: Log completed follow-ups with communication medium tags (Call, Email, Meeting, WhatsApp, Demo), detailed discussion notes, outcomes, and automated scheduling of sequence follow-ups (`#1`, `#2`, `#3`...).
-  **Audit Timeline**: Immutable chronological activity stream tracking lead creations, updates, stage transitions, and follow-up interaction history.
-  **Responsive UI/UX**: Built with Tailwind CSS, custom modal dialogs, loading spinners, mobile navigation drawers, and toast alerts.

---

## Tech Stack & Key Libraries

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | UI Library & Component-based Architecture |
| **TypeScript** | `^5.5.3` | Type-safety, interfaces, and compile-time validation |
| **Vite** | `^5.4.6` | Next-generation frontend build tool & HMR dev server |
| **Tailwind CSS** | `^3.4.12` | Utility-first CSS framework for custom responsive styling |
| **TanStack React Query** | `^5.56.2` | Asynchronous server-state management & cache invalidation |
| **Axios** | `^1.7.7` | Promise-based HTTP client with request/response interceptors |
| **React Router DOM** | `^6.26.2` | Declarative client-side routing & route guards |
| **React Hook Form** | `^7.53.0` | High-performance form state management |
| **Zod** | `^3.23.8` | Schema validation for form input & type inference |
| **Lucide React** | `^0.441.0` | Modern, accessible UI icons |

---

## Project Structure

```
client/
├── public/                 # Static assets & favicon
├── src/
│   ├── api/                # Axios instance & interceptors setup
│   │   └── axios.ts
│   ├── assets/             # SVG icons & custom vector graphics
│   ├── components/         # Reusable UI layout & core primitives
│   │   ├── common/         # Button, Card, Input, Badge, Loader, ConfirmModal
│   │   └── layout/         # AppLayout, Header, Sidebar
│   ├── context/            # Global React Contexts
│   │   └── AuthContext.tsx # Authentication state & JWT storage manager
│   ├── features/           # Domain-specific feature modules
│   │   ├── auth/           # Login & registration logic
│   │   ├── dashboard/      # Dashboard metrics API connectors & views
│   │   └── leads/          # ActivityTimeline, CompleteFollowUpModal, leadApi
│   ├── pages/              # Application Page Views
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LeadsPage.tsx
│   │   ├── LeadCreatePage.tsx
│   │   ├── LeadDetailsPage.tsx
│   │   └── LeadEditPage.tsx
│   ├── routes/             # App routing & protected route wrappers
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   ├── types/              # TypeScript global data models & enums
│   │   └── index.ts
│   ├── App.tsx             # Root App component
│   ├── main.tsx            # Application mounting & QueryClientProvider setup
│   └── index.css           # Tailwind CSS directives & global styling
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Environment Variables

Create a `.env` file in the root of the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started

### 1. Installation

Navigate to the `client` folder and install dependencies:

```bash
cd client
npm install
```

### 2. Run Local Development Server

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 3. Build for Production

Compile TypeScript and build the optimized production assets:

```bash
npm run build
```

### 4. Preview Production Build

Locally preview the generated production build in `dist/`:

```bash
npm run preview
```

---

## Architecture Highlights

### 1. HTTP Interceptors & Token Handling (`src/api/axios.ts`)
- Automatically reads the JWT from `localStorage` (`leadflow_token`) and appends an `Authorization: Bearer <token>` header to all outgoing API requests.
- Intercepts `401 Unauthorized` responses to clear stored user session data and cleanly redirect users to `/auth/login`.

### 2. Declarative Server State (`TanStack React Query`)
- Manages client caching, automatic background revalidation, and loading states.
- Mutations for completing follow-ups or updating lead stages trigger targeted cache invalidations (`queryClient.invalidateQueries`), ensuring that the Lead Details page, Timeline, Leads Table, and Dashboard update instantaneously.

---


