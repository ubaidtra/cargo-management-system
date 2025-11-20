import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      senderName, senderContact,
      receiverName, receiverContact,
      destination, weight, sendingDate, paymentStatus,
      numberOfItems, description
    } = body;

    // Fetch Pricing Configuration
    let pricing = await prisma.pricingConfig.findFirst();
    if (!pricing) {
      // Fallback if config doesn't exist (though it should)
      pricing = { baseCost: 10, costPerKg: 5 };
    }

    // Dynamic Cost Calculation
    const cost = pricing.baseCost + (parseFloat(weight) * pricing.costPerKg);

    // Generate Tracking Number
    const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const cargo = await prisma.cargo.create({
      data: {
        trackingNumber,
        senderName,
        senderContact,
        receiverName,
        receiverContact,
        destination,
        weight: parseFloat(weight),
        numberOfItems: numberOfItems ? parseInt(numberOfItems) : 1,
        description: description || '',
        cost,
        status: 'SENT',
        paymentStatus: paymentStatus || 'UNPAID',
        sendingDate: sendingDate ? new Date(sendingDate) : new Date(),
      },
    });

    return NextResponse.json(cargo);
  } catch (error) {
    console.error('Error creating cargo:', error);
    return NextResponse.json({ error: 'Failed to create cargo' }, { status: 500 });
  }
}
