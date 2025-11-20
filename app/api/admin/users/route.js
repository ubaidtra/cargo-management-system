import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'OPERATOR' },
      select: { id: true, username: true, role: true } // Don't return passwords
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        username,
        password, // Storing plain text for this MVP as requested
        role: 'OPERATOR'
      },
    });

    return NextResponse.json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

