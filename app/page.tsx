'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import DashboardLayout from './components/DashboardLayout';
import { getSession } from '@/lib/authClient';

interface FinancialData {
  income: any[];
  expenses: any[];
  receivables: any[];
  payables: any[];
  receivablesTotal: number;
  payablesTotal: number;
}

export default function Dashboard() {
  const [data, setData] = useState<FinancialData>({
    income: [],
    expenses: [],
    receivables: [],
    payables: [],
    receivablesTotal: 0,
    payablesTotal: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const session = await getSession();
        if (!session) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate totals
  const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalReceivables = data.receivablesTotal;
  const totalPayables = data.payablesTotal;
  
  // Calculate net balance including receivables and payables
  const operatingBalance = totalIncome - totalExpenses;
  const netReceivables = totalReceivables - totalPayables;
  const totalBalance = operatingBalance + netReceivables;
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0';

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 animate-fadeIn">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Financial Overview</h1>
            <p className="mt-2 text-sm text-primary-light">Your financial summary and recent transactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
          <div className="bg-primary text-secondary overflow-hidden shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02]">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                  <svg className="h-6 w-6 text-secondary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-light truncate">Monthly Income</dt>
                    <dd className="text-lg sm:text-2xl lg:text-3xl font-semibold text-secondary leading-tight">${totalIncome.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
                  <svg className="h-6 w-6 text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Expenses</dt>
                    <dd className="text-2xl font-semibold text-gray-900">${totalExpenses.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-full">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Operating Balance</dt>
                    <dd className={`text-2xl font-semibold ${operatingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${operatingBalance.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-full">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Net Balance</dt>
                    <dd className={`text-2xl font-semibold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${totalBalance.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-full">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Savings Rate</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{savingsRate}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
                  <svg className="h-6 w-6 text-secondary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Receivables</dt>
                    <dd className="text-2xl font-semibold text-blue-600">${totalReceivables.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-orange-100 rounded-full">
                  <svg className="h-6 w-6 text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Payables</dt>
                    <dd className="text-2xl font-semibold text-orange-600">${totalPayables.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Recent Income</h3>
                <a href="/income" className="text-xs sm:text-sm lg:text-base font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">View all</a>
              </div>
              <div className="mt-5 flow-root">
                <ul role="list" className="divide-y divide-gray-200 -my-2 sm:-my-3 lg:-my-4">
                  {data.income.map((item) => (
                    <li key={item.id} className="py-5 transition-colors duration-200 hover:bg-primary-light/10">
                      <div className="flex items-center space-x-4 group">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs sm:text-sm lg:text-base text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${item.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                <a href="/expenses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">View all</a>
              </div>
              <div className="mt-5 flow-root">
                <ul className="-my-5 divide-y divide-primary-light">
                  {data.expenses.map((item) => (
                    <li key={item.id} className="py-5 transition-colors duration-200 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ${item.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Receivables</h3>
                <a href="/receivables" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">View all</a>
              </div>
              <div className="mt-5 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {data.receivables.map((item) => (
                    <li key={item.id} className="py-5 transition-colors duration-200 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">{new Date(item.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            ${item.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Payables</h3>
                <a href="/payables" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">View all</a>
              </div>
              <div className="mt-5 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {data.payables.map((item) => (
                    <li key={item.id} className="py-5 transition-colors duration-200 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">{new Date(item.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                            ${item.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}