# PremiumFresh Project Context

## Operational Mandates
- **Environment Awareness**: At the start of every session, always check the operating system and shell (e.g., `win32` with `powershell`). Ensure all shell commands (`run_shell_command`) are compatible with the current environment. Do not assume Linux/bash defaults if running on Windows.

## Overview
**PremiumFresh** is a subscription-based information system for weekly vegetable deliveries. It connects Customers, Drivers, and Administrators through a unified platform built with Next.js and Supabase.

## Core Features
1.  **Customer Portal**:
    -   **Registration/Login**: Secure authentication via Supabase. Users can register for a 'Customer' or 'Driver' role.
    -   **Weekly Selection**: Customers select their weekly vegetables from a curated list at `/order/new`. Includes a map-based location picker with address search for precise delivery instructions.
    -   **Dashboard**: View active subscriptions and order status.
2.  **Driver Dashboard**:
    -   **Tabbed Interface**: A multi-tab dashboard for drivers to manage their workflow.
    -   **Profile & Active Orders**: Shows the driver's profile and a list of all deliveries currently in progress.
    -   **Available Orders**: A queue of pending orders that can be accepted by any driver.
    -   **Completed Orders**: A history of the driver's completed deliveries.
    -   **Navigation**: "Navigate" button integrates with Google Maps for easy routing on active orders.
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
- **User Metadata**: Each Supabase user has a `role` field within their `user_metadata`. This defines their access level:
  - `admin`: Full access to the admin dashboard and order monitoring.
  - `customer`: Access to personal dashboard and weekly vegetable selection.
  - `driver`: Access to the tabbed driver dashboard to find, accept, and manage deliveries.
- **Authentication**: Uses `@supabase/ssr`. A root `middleware.ts` handles session refreshing.
- **Session Synchronization**: Login and logout processes utilize hard redirects (`window.location.href`) to ensure the entire page reloads and the authentication state is correctly synchronized across the application.
- **Client Usage**:
  - `lib/supabase/client.ts`: Exports `createClient` for Client Components.
  - `lib/supabase/server.ts`: Exports `createClient` for Server Components/Actions (requires `await`).

## Development Guidelines
-   **Server Actions**: Use `use server` for all form submissions and data mutations. Always initialize a server-side Supabase client within the action.
-   **Client Components**: Use `use client` for interactive UI elements.
-   **Authentication**: Use `useAuth` hook for client-side session access; use the server client to verify sessions for protected actions/components.
-   **Service Pattern**: `OrderService` methods require a `SupabaseClient` instance to be passed as the first argument to ensure the correct context (client vs server) is used.
-   **Styling**: Prioritize Tailwind CSS utility classes for consistent design.

## Current State
-   **Vegetable Selection**: Implemented in `/order/new` using the `AVAILABLE_VEGETABLES` constant from `lib/definitions/order.ts`.
-   **Location Picking**: Interactive map integrated into the order form, allowing users to search for addresses or click to select a point.
-   **Order Storage**: Orders are stored in the `orders` table with a JSON `vegetables` column, a string `address`, and `lat`/`lon` coordinates for precise delivery.
-   **SSR Integration**: Full integration with `@supabase/ssr` completed for secure, cookie-based session management across the App Router.
