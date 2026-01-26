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
- **Schema**: Defined in `shared/schema.ts` with five main tables:
  - `users`: User accounts with username, password, and role
  - `ngos`: NGO registrations with approval workflow (Pending/Approved/Rejected status)
  - `announcements`: News and announcements with title, content, imageUrl (optional), published status, and author tracking
  - `siteContent`: Editable website content with key-based lookup for page elements (homepage title, descriptions, etc.)
  - `notices`: Official government notices/circulars (التعاميم) with noticeNumber, noticeDate, title (optional), pdfUrl

### Public Page Design Pattern
All public pages follow a consistent design pattern for visual cohesion:
- **Hero Banner**: Green bg-primary banner at top with white text, centered icon, title and description
- **Main Background**: Light gray bg-gray-50/50 for content areas
- **Cards**: White cards with shadow-sm, rounded-xl styling
- **Layout**: Container with max-width constraints, RTL direction

### News/Announcements Feature
- **Public News List**: Grid layout at `/announcements` with clickable news cards showing featured images
- **Article Detail Page**: Full article view at `/news/:id` with RTL-compatible layout and back navigation
- **Image Uploads**: Admin can upload images (up to 5MB) when creating/editing announcements using presigned URL pattern via object storage
- **Admin Management**: Full CRUD for announcements in admin panel with image preview and thumbnail display
- **Validation**: Drizzle-Zod integration for type-safe schema validation

### Opportunities Feature
- **Public Opportunities List**: Grid layout at `/opportunities` showing all job and volunteer opportunities from approved NGOs
- **Opportunity Detail Page**: Full opportunity view at `/opportunities/:id` with comprehensive information display
- **Opportunity ID Format**: IDs follow pattern `job-{ngoId}-{index}` or `volunteer-{ngoId}-{index}`
- **API Endpoint**: GET `/api/public/opportunities/:id` returns detailed opportunity information
- **Features**: Purpose, qualifications, skills, experience, work fields, commitment nature, vacancy numbers
- **Navigation**: Links to associated NGO profiles at `/ngos/:id`

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
The authentication system uses secure password hashing with bcrypt and admin-only user management:
- Session-based authentication with cookies
- Bcrypt password hashing (SALT_ROUNDS=10) with legacy plaintext migration on login
- Admin-only user creation with auto-generated passwords
- Extended user fields: firstName, lastName, email, phone, organizationName, governorate, registrationNumber, registrationDate
- Account status management (active/suspended) with login blocking for suspended accounts
- Role-based authorization middleware (user/admin roles)

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