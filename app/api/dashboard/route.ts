import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [income, expenses, receivables, payables] = await Promise.all([
      prisma.income.findMany({
        where: { userId: session.id },
        orderBy: { date: 'desc' },
        take: 5,
      }),
      prisma.expense.findMany({
        where: { userId: session.id },
        orderBy: { date: 'desc' },
        take: 5,
      }),
      prisma.receivable.findMany({
        where: { userId: session.id },
        orderBy: { dueDate: 'desc' },
        take: 5,
      }),
      prisma.payable.findMany({
        where: { userId: session.id },
        orderBy: { dueDate: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate totals
    const [receivablesTotal, payablesTotal] = await Promise.all([
      prisma.receivable.aggregate({
        where: { userId: session.id, status: { not: 'PAID' } },
        _sum: { amount: true }
      }),
      prisma.payable.aggregate({
        where: { userId: session.id, status: { not: 'PAID' } },
        _sum: { amount: true }
      })
    ]);

    return NextResponse.json({
      income,
      expenses,
      receivables,
      payables,
      receivablesTotal: receivablesTotal._sum.amount || 0,
      payablesTotal: payablesTotal._sum.amount || 0
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}