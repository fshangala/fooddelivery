'use client';

export default function Footer() {
  return (
    <footer className="p-4 bg-linear-to-b from-primary-900 to-secondary-900 text-white text-center">
      &copy; {new Date().getFullYear()} Food Delivery. All rights reserved.
      <a href="https://www.flaticon.com/free-icons/courier" title="courier icons">Courier icons created by mia elysia - Flaticon</a>
    </footer>
  );
}