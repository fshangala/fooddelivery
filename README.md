# PremiumFresh Subscription System

**PremiumFresh** is an information system built with Next.js that enables customers to subscribe to a weekly vegetable delivery service on a monthly basis. The platform is designed to streamline order management for customers, drivers, and administrators.

---

## 🚀 Key Features

- **Customer Portal**: Users can register, log in, and manage their monthly vegetable subscriptions. Deliveries are scheduled on a weekly basis.
- **Driver Dashboard**: Drivers have an interface showing a queue of available deliveries.
  - Accept deliveries one after the other.
  - Each assigned delivery includes a **Navigate** button that opens Google Maps to guide the driver to the drop‑off location.
- **Admin Area**: Administrators can view orders and monitor activity through a secure section of the app.
- **Authentication**: Built-in register, login, and session management using Supabase with `@supabase/ssr`.
- **Responsive UI**: Components such as headers, forms, modals, and order lists are included in the `lib/components` directory.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 13+](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Auth & Database**: [Supabase](https://supabase.com) with `@supabase/ssr`
- **Deployment**: Optimized for [Vercel](https://vercel.com)

---

## 🧩 Getting Started

1. **Install dependencies**

```bash
npm install
# or yarn install
# or pnpm install
```

2. **Environment variables**

Create a `.env.local` file with Supabase keys and any other required configuration (e.g.:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

)

3. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the application.

---

## 📁 Project Structure Overview

```
app/          # Next.js app routes and layouts
lib/          # reusable utilities and components
  actions/        # Server actions (login, logout, register, order)
  components/     # UI components (headers, forms, modals, etc.)
  definitions/    # Type definitions and shared constants
  services/       # Business logic and database interactions
  supabase/       # Supabase client setup (client, server, middleware)
middleware.ts # Next.js middleware for session management
```

---

## 💡 Usage Notes

- Drivers should click the **Navigate** button on each delivery to open Google Maps directions.
- Admin and customer interfaces are separated under `(admin)` and `(landing)` route segments.
- **Supabase Clients**: Always use the appropriate client helper:
    - Use `createClient()` from `@/lib/supabase/client` in Client Components.
    - Use `await createClient()` from `@/lib/supabase/server` in Server Components, Server Actions, and Route Handlers.

---

## 📦 Deployment

Deploy the project using Vercel or any platform that supports Next.js. Ensure environment variables are configured in the deployment settings.

---

## 📖 Learn More

For additional help with Next.js refer to the [Next.js Documentation](https://nextjs.org/docs).


---

© 2026 PremiumFresh. All rights reserved.
