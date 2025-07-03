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

    const payables = await prisma.payable.findMany({
      where: { userId: session.id },
      orderBy: { dueDate: 'desc' },
    });

    return NextResponse.json(payables);
  } catch (error) {
    console.error('Error fetching payables:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, amount, dueDate, status, description } = await request.json();

    // Validate required fields
    if (!title || !amount || !dueDate || !status) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const payable = await prisma.payable.create({
      data: {
        name: title,  // Map title to name field
        amount,
        dueDate: new Date(dueDate),
        status,
        note: description,  // Map description to note field
        userId: session.id,
      }
    });

    return NextResponse.json(payable);
  } catch (error) {
    console.error('Error creating payable:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}