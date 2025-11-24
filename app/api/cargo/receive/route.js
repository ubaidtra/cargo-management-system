import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/logger';

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
    const { trackingNumber, action, operatorId, operatorUsername } = body;

    if (!trackingNumber || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Get cargo details before update
    const cargoBefore = await prisma.cargo.findUnique({
      where: { trackingNumber }
    });

    if (!cargoBefore) {
      return NextResponse.json({ error: 'Cargo not found' }, { status: 404 });
    }

    let updateData = {};
    let logAction;
    if (action === 'PAY') {
      updateData.paymentStatus = 'PAID';
      logAction = 'PAY_CARGO';
    } else if (action === 'RECEIVE') {
      updateData.status = 'RECEIVED';
      logAction = 'RECEIVE_CARGO';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const cargo = await prisma.cargo.update({
      where: { trackingNumber },
      data: updateData,
    });

    // Log detailed transaction
    try {
      const transactionDetails = {
        trackingNumber: cargo.trackingNumber,
        action: action,
        senderName: cargo.senderName,
        receiverName: cargo.receiverName,
        destination: cargo.destination,
        weight: cargo.weight,
        cost: cargo.cost,
        previousStatus: cargoBefore.status,
        previousPaymentStatus: cargoBefore.paymentStatus,
        newStatus: cargo.status,
        newPaymentStatus: cargo.paymentStatus,
        timestamp: new Date().toISOString()
      };
      
      await logActivity(
        logAction,
        operatorId || null,
        operatorUsername || 'Unknown',
        JSON.stringify(transactionDetails)
      );
    } catch (logError) {
      console.warn('Failed to log cargo transaction:', logError.message);
    }

    return NextResponse.json(cargo);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating cargo' }, { status: 500 });
  }
}

