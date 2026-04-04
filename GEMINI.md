# PremiumFresh Project Context

## Operational Mandates
- **Environment Awareness**: At the start of every session, always check the operating system and shell (e.g., `win32` with `powershell`). Ensure all shell commands (`run_shell_command`) are compatible with the current environment. Do not assume Linux/bash defaults if running on Windows.

## Overview
**PremiumFresh** is a subscription-based information system for weekly vegetable deliveries. It connects Customers, Drivers, and Administrators through a unified platform built with Next.js and Supabase.

## Core Features
1.  **Customer Portal**:
    -   **Registration/Login**: Secure authentication via Supabase. Users can register for a 'Customer' or 'Driver' role.
    -   **Weekly Selection**: Customers select their weekly vegetables from a curated list at `/order/new`. Includes a map-based location picker with address search for precise delivery instructions.
    -   **Dashboard & Orders**: A landing dashboard for active subscriptions and a dedicated page for detailed order history.
    -   **Profile**: Dedicated page for account settings and personal information.
2.  **Driver Dashboard**:
    -   **Multi-Page Interface**: Dedicated pages for different aspects of the delivery workflow.
    -   **Profile & Active Orders**: Landing dashboard showing driver profile summary and deliveries in progress.
    -   **Available Orders**: Dedicated queue of pending orders ready to be accepted at `/available`.
    -   **Completed Orders**: Comprehensive history of the driver's deliveries at `/history`.
    -   **Navigation**: "Navigate" button integrates with Google Maps for routing on active orders.
3.  **Admin Area**:
    -   **Order Management**: Admins monitor all orders, status, and details under `/admin/orders`.

## Tech Stack
-   **Framework**: Next.js 13+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (via global styles and utility classes)
-   **Maps**: Leaflet & React-Leaflet (with OpenStreetMap/Nominatim for geocoding)
-   **Database & Auth**: Supabase with `@supabase/ssr` for robust session handling.
-   **Deployment**: Vercel-ready

## Key Directories
-   `app/(landing)`: Public-facing pages (Landing, Login, Register, Customer Dashboard).
-   `app/(admin)`: Protected admin routes.
-   `lib/actions`: Server actions for form handling (Login, Register, Order Creation).
-   `lib/components`: Reusable UI components (Forms, Modals, Headers).
-   `lib/definitions`: Shared types and constants (e.g., `AVAILABLE_VEGETABLES`).
-   `lib/supabase`: Supabase client configurations for client, server, and middleware.

## User Roles & Authentication
- **Profiles Table**: User roles (admin, customer, driver) and profile details (name, phone) are stored in a dedicated `profiles` table in the `public` schema.
- **Role Enforcement**: User roles are verified server-side using the `ProfileService` and client-side using the `useProfile` hook from the `AuthProvider`.
- **Admin Setup (Bootstrap)**: If no admin user exists in the system, the `/admin` dashboard automatically displays a setup form to create the first admin account. This process uses a secure Postgres function (`check_admin_exists`) via RPC to query the `profiles` table safely.
- **Authentication**: Uses `@supabase/ssr`. A root `middleware.ts` handles session refreshing.
- **Session Synchronization**: Login and logout processes utilize hard redirects (`window.location.href`) to ensure the entire page reloads and the authentication state is correctly synchronized across the application.
- **Client Usage**:
  - `lib/supabase/client.ts`: Exports `createClient` for Client Components.
  - `lib/supabase/server.ts`: Exports `createClient` for Server Components/Actions (requires `await`).

## Development Guidelines
-   **Next.js: ALWAYS read docs before coding**: Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
-   **Server Actions**: Use `use server` for all form submissions and data mutations. Always initialize a server-side Supabase client within the action.
-   **Client Components**: Use `use client` for interactive UI elements.
-   **Authentication**: Use `useAuth` hook for client-side session access; use the server client to verify sessions for protected actions/components.
-   **Service Pattern**: `OrderService` methods require a `SupabaseClient` instance to be passed as the first argument to ensure the correct context (client vs server) is used.
-   **Styling**: Prioritize Tailwind CSS utility classes for consistent design.
