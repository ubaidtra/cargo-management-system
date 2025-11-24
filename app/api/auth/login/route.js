import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/logger';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Block old admin credentials
    if (username === 'admin' && password === 'admin123') {
      await logActivity('LOGIN_FAILED', null, username, 'Attempted login with old admin credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Special check for Super Admin (if not in DB yet)
    if (username === 'ubaidtra' && password === 'trawally2025') {
      try {
        await logActivity('LOGIN', '0', 'ubaidtra', 'Super admin login');
      } catch (logError) {
        console.warn('Failed to log activity:', logError.message);
      }
      return NextResponse.json({ 
        id: 0, 
        username: 'ubaidtra', 
        role: 'ADMIN',
        isSuperAdmin: true
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      await logActivity('LOGIN_FAILED', null, username, 'Invalid credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if account is active
    if (user.isActive === false) {
      await logActivity('LOGIN_FAILED', user.id, username, 'Attempted login with deactivated account');
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
    }

    // Log successful login
    try {
      await logActivity('LOGIN', user.id, username, `Successful ${user.role} login`);
    } catch (logError) {
      console.warn('Failed to log activity:', logError.message);
    }

    // Check if user is super admin
    const isSuperAdminUser = username === 'ubaidtra';

    return NextResponse.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role,
      isSuperAdmin: isSuperAdminUser
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

