import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const expenses = await prisma.expense.findMany({
      where: { userId: session.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, amount, date, category, description: note } = await request.json();

    // Validate required fields
    if (!title || !amount || !date || !category) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        date: new Date(date),
        category,
        note,
        userId: session.id,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}