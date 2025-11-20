import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trackingNumber = searchParams.get('trackingNumber');

  if (!trackingNumber) {
    return NextResponse.json({ error: 'Tracking number required' }, { status: 400 });
  }

  try {
    const cargo = await prisma.cargo.findUnique({
      where: { trackingNumber },
    });

    if (!cargo) {
      return NextResponse.json({ error: 'Cargo not found' }, { status: 404 });
    }

    return NextResponse.json(cargo);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching cargo' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { trackingNumber, action } = body;

    if (!trackingNumber || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    let updateData = {};
    if (action === 'PAY') {
      updateData.paymentStatus = 'PAID';
    } else if (action === 'RECEIVE') {
      updateData.status = 'RECEIVED';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const cargo = await prisma.cargo.update({
      where: { trackingNumber },
      data: updateData,
    });

    return NextResponse.json(cargo);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating cargo' }, { status: 500 });
  }
}

