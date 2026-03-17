# PremiumFresh Project Context

## Operational Mandates
- **Environment Awareness**: At the start of every session, always check the operating system and shell (e.g., `win32` with `powershell`). Ensure all shell commands (`run_shell_command`) are compatible with the current environment. Do not assume Linux/bash defaults if running on Windows.

## Overview
**PremiumFresh** is a subscription-based information system for weekly vegetable deliveries. It connects Customers, Drivers, and Administrators through a unified platform built with Next.js and Supabase.

## Core Features
1.  **Customer Portal**:
    -   **Registration/Login**: Secure authentication via Supabase.
    -   **Weekly Selection**: Customers select their weekly vegetables from a curated list at `/order/new`.
    -   **Dashboard**: View active subscriptions and order status.
2.  **Driver Dashboard**:
    -   **Delivery Queue**: Drivers view assigned deliveries.
    -   **Navigation**: "Navigate" button integrates with Google Maps for easy routing.
3.  **Admin Area**:
    -   **Order Management**: Admins monitor all orders, status, and details under `/admin/orders`.

## Tech Stack
-   **Framework**: Next.js 13+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (via global styles and utility classes)
-   **Database & Auth**: Supabase
-   **Deployment**: Vercel-ready

## Key Directories
-   `app/(landing)`: Public-facing pages (Landing, Login, Register, Customer Dashboard).
-   `app/(admin)`: Protected admin routes.
-   `lib/actions`: Server actions for form handling (Login, Register, Order Creation).
-   `lib/components`: Reusable UI components (Forms, Modals, Headers).
-   `lib/supabase`: Supabase client configuration.

## User Roles & Authentication
- **User Metadata**: Each Supabase user has a `role` field within their `user_metadata`. This defines their access level:
  - `admin`: Full access to the admin dashboard and order monitoring.
  - `customer`: Access to personal dashboard and weekly vegetable selection.
  - `driver`: Access to the delivery queue and navigation tools.
- **Authentication**: Built-in register and login flows use these roles to redirect users to their respective interfaces.

## Development Guidelines
-   **Server Actions**: Use `use server` for all form submissions and data mutations.
-   **Client Components**: Use `use client` for interactive UI elements (forms, modals).
-   **Authentication**: Use `useAuth` hook for client-side session access; verify sessions server-side for protected actions.
-   **Styling**: Prioritize Tailwind CSS utility classes for consistent design.

## Current State
-   **Vegetable Selection**: Implemented in `/order/new` with multi-select checkboxes.
-   **Order Storage**: Orders are stored in the `orders` table with a JSON `vegetables` column and `address` field.
