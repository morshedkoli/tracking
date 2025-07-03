'use client';

import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-primary">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-xl font-bold text-secondary">Finance Tracker</span>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              <a
                href="/"
                className={`${pathname === '/' ? 'bg-indigo-700 text-white' : 'text-secondary hover:bg-primary-light transition-colors duration-200'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <svg className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
              <a
                href="/income"
                className={`${pathname === '/income' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <svg className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Income
              </a>
              <a
                href="/expenses"
                className={`${pathname === '/expenses' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <svg className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Expenses
              </a>
              <a
                href="/payables"
                className={`${pathname === '/payables' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <svg className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Payables
              </a>
              <a
                href="/receivables"
                className={`${pathname === '/receivables' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <svg className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Receivables
              </a>
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-primary-light p-4">
            <div className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700">
              <svg className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}