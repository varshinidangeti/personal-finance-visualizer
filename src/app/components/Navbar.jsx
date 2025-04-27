"use client"

// src/app/components/Navbar.jsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700';
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center mr-6">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Finance Tracker
              </Link>
            </div>
            <div className="flex ml-6 space-x-8">
              <Link href="/" className={`inline-flex items-center px-1 pt-1 ${isActive('/')}`}>
                Dashboard
              </Link>
              <Link href="/transactions" className={`inline-flex items-center px-1 pt-1 ${isActive('/transactions')}`}>
                Transactions
              </Link>
              <Link href="/budgets" className={`inline-flex items-center px-1 pt-1 ${isActive('/budgets')}`}>
                Budgets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
