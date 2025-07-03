'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  note?: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
      setTotalExpenses(data.reduce((sum: number, expense: Expense) => sum + expense.amount, 0));
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date'),
      category: formData.get('category'),
      description: formData.get('description'),
    };

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to add expense');
      
      fetchExpenses();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
      <div className="sm:flex sm:items-center sm:justify-between bg-gradient-to-r from-red-600 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">Expenses Management</h1>
          <p className="mt-2 text-red-100">Track and manage your expenses</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-sm text-red-100">Total Expenses</p>
            <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:border-red-500 transition-all duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Expense</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm transition-all duration-200 hover:border-red-300"
                    placeholder="Groceries, Rent, etc."
                  />
                </div>

                <div className="group">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Amount</label>
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
                      className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm transition-all duration-200 hover:border-red-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Date</label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm transition-all duration-200 hover:border-red-300"
                  />
                </div>

                <div className="group">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Category</label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm transition-all duration-200 hover:border-red-300"
                  >
                    <option value="food">Food & Dining</option>
                    <option value="transportation">Transportation</option>
                    <option value="utilities">Utilities</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health & Medical</option>
                    <option value="housing">Housing & Rent</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm transition-all duration-200 hover:border-red-300"
                    placeholder="Additional details..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Expense History</h2>
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
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-red-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                          {expense.note && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{expense.note}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 capitalize">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                          ${expense.amount.toFixed(2)}
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