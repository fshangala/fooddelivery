'use client';

export default function Header() {
  return (
    <header>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <a href="/" className="inline-flex items-center gap-1 whitespace-nowrap">
            <img src="/logo.png" alt="Food Delivery Logo" className="h-8" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-br from-primary-600 to-secondary-600">FoodDelivery</span>
          </a>
        </div>
        <div></div>
      </div>
    </header>
  );
}