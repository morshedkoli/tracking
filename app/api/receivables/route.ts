import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const receivables = await prisma.receivable.findMany({
      where: {
        userId: session.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.receivable.aggregate({
      where: {
        userId: session.id,
        status: { in: ['pending', 'PENDING'] }
      },
      _sum: {
        amount: true
      }
    });

    return NextResponse.json({
      receivables,
      total: total._sum.amount || 0
    });
  } catch (error) {
    console.error('Error fetching receivables:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { title, amount, dueDate, status, description } = await request.json();

    const receivable = await prisma.receivable.create({
      data: {
        name: title,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status,
        note: description,
        userId: session.id
      }
    });

    return NextResponse.json(receivable);
  } catch (error) {
    console.error('Error creating receivable:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}