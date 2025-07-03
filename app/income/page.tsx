'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/authClient';
import DashboardLayout from '@/app/components/DashboardLayout';

interface Income {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  note?: string;
}

async function addIncome(formData: FormData) {
  const title = formData.get('title') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const date = formData.get('date') as string;
  const category = formData.get('category') as string;
  const note = formData.get('description') as string;

  const response = await fetch('/api/income', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      amount,
      date,
      category,
      note,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add income');
  }

  return response.json();
}

export default function IncomePage() {
  const router = useRouter();
  const [income, setIncome] = useState<Income[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }
      setSession(session);
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await fetch('/api/income');
        if (!response.ok) {
          throw new Error('Failed to fetch income');
        }
        const data = await response.json();
        setIncome(data);
      } catch (error) {
        console.error('Error fetching income:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchIncome();
    }
  }, [session]);

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
      <div className="sm:flex sm:items-center sm:justify-between bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-6 text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">Income Management</h1>
          <p className="mt-2 text-indigo-100">Track and manage your income sources</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-sm text-indigo-100">Total Income</p>
            <p className="text-3xl font-bold">${totalIncome.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:border-indigo-500 transition-all duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Income</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await addIncome(new FormData(e.currentTarget));
                  router.refresh();
                  // Reset form
                  (e.target as HTMLFormElement).reset();
                  // Refresh income data
                  const response = await fetch('/api/income');
                  if (response.ok) {
                    const data = await response.json();
                    setIncome(data);
                  }
                } catch (error) {
                  console.error('Error adding income:', error);
                }
              }} className="space-y-6">
                <div className="group">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:border-indigo-300"
                    placeholder="Salary, Freelance, etc."
                  />
                </div>

                <div className="group">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Amount</label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      required
                      step="0.01"
                      min="0"
                      className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:border-indigo-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Date</label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:border-indigo-300"
                  />
                </div>

                <div className="group">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Category</label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:border-indigo-300"
                  >
                    <option value="salary">Salary</option>
                    <option value="freelance">Freelance</option>
                    <option value="investment">Investment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Note</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:border-indigo-300"
                    placeholder="Additional details..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Add Income
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Income History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Date</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {income.map((item) => (
                      <tr key={item.id} className="hover:bg-indigo-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          {item.note && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.note}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                          ${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}