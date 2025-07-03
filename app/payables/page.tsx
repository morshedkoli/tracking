'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';

interface Payable {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: string;
  description?: string;
}

export default function PayablesPage() {
  const [payables, setPayables] = useState<Payable[]>([]);
  const [totalPayables, setTotalPayables] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchPayables();
  }, []);

  const fetchPayables = async () => {
    try {
      const response = await fetch('/api/payables');
      if (!response.ok) throw new Error('Failed to fetch payables');
      const data = await response.json();
      setPayables(data);
      setTotalPayables(data.reduce((sum: number, payable: Payable) => sum + payable.amount, 0));
    } catch (error) {
      console.error('Error fetching payables:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount') as string),
      dueDate: formData.get('dueDate'),
      status: formData.get('status'),
      description: formData.get('description'),
    };

    try {
      const response = await fetch('/api/payables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to add payable');
      
      fetchPayables();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding payable:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
      <div className="sm:flex sm:items-center sm:justify-between bg-gradient-to-r from-purple-600 to-indigo-500 rounded-xl p-6 text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">Payables Management</h1>
          <p className="mt-2 text-purple-100">Track and manage your payables</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-sm text-purple-100">Total Payables</p>
            <p className="text-3xl font-bold">${totalPayables.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:border-purple-500 transition-all duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Payable</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-all duration-200 hover:border-purple-300"
                    placeholder="Rent, Utilities, etc."
                  />
                </div>

                <div className="group">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Amount</label>
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
                      className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-all duration-200 hover:border-purple-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-all duration-200 hover:border-purple-300"
                  />
                </div>

                <div className="group">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Status</label>
                  <select
                    name="status"
                    id="status"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-all duration-200 hover:border-purple-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div className="group">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-all duration-200 hover:border-purple-300"
                    placeholder="Additional details..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Add Payable
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Payables History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Due Date</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payables.map((payable) => (
                      <tr key={payable.id} className="hover:bg-purple-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payable.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payable.name}</div>
                          {payable.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{payable.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(payable.status)}`}>
                            {payable.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-purple-600">
                          ${payable.amount.toFixed(2)}
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