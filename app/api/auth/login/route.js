import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Block old admin credentials
    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Special check for default Admin (if not in DB yet)
    if (username === 'ubaidtra' && password === 'trawally2025') {
      return NextResponse.json({ 
        id: 0, 
        username: 'ubaidtra', 
        role: 'ADMIN' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role 
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

