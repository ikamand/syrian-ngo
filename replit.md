# Syrian NGO Management Platform

## Overview

A full-stack web application for the Syrian government to manage NGO registrations. The platform allows organizations to register and manage their NGO information while administrators can review and approve entries. Built with an RTL Arabic interface using a green government theme.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled using Vite
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Layout**: RTL (right-to-left) Arabic layout with Cairo font family
- **Theme**: Syrian government-inspired green color palette with CSS custom properties

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful API endpoints defined in `shared/routes.ts` using Zod for validation
- **Session Management**: Express sessions with memory store (development) or PostgreSQL store (production)
- **Authentication**: Cookie-based session authentication with role-based access control (user/admin roles)

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with two main tables:
  - `users`: User accounts with username, password, and role
  - `ngos`: NGO registrations with approval workflow (Pending/Approved/Rejected status)
- **Validation**: Drizzle-Zod integration for type-safe schema validation

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks (auth, ngos, toast)
│       ├── pages/        # Route page components
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Data access layer (memory/database)
│   └── db.ts         # Database connection
├── shared/           # Shared code between client and server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API contract definitions with Zod
└── migrations/       # Drizzle database migrations
```

### Authentication Design
The authentication system is intentionally designed as a temporary dummy implementation that can be easily replaced with Auth0, Clerk, or similar providers. Current implementation uses:
- Session-based authentication with cookies
- Simple username/password storage
- Role-based authorization middleware

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations with `npm run db:push`

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod`: Database ORM and validation
- `express-session`: Session management
- `@tanstack/react-query`: Data fetching and caching
- `@radix-ui/*`: Accessible UI primitives (via shadcn/ui)
- `wouter`: Lightweight client-side routing
- `zod`: Schema validation for API contracts

### Development Tools
- `vite`: Frontend build tool with HMR
- `tsx`: TypeScript execution for server
- `esbuild`: Production server bundling