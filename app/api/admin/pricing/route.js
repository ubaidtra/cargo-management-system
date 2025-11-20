import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let config = await prisma.pricingConfig.findFirst();
    
    if (!config) {
      config = await prisma.pricingConfig.create({
        data: {
          baseCost: 10.0,
          costPerKg: 5.0,
        },
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing config' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { baseCost, costPerKg } = body;

    // Validate input
    if (baseCost < 0 || costPerKg < 0) {
       return NextResponse.json({ error: 'Values must be non-negative' }, { status: 400 });
    }

    let config = await prisma.pricingConfig.findFirst();

    if (config) {
      config = await prisma.pricingConfig.update({
        where: { id: config.id },
        data: {
          baseCost: parseFloat(baseCost),
          costPerKg: parseFloat(costPerKg),
        },
      });
    } else {
      config = await prisma.pricingConfig.create({
        data: {
          baseCost: parseFloat(baseCost),
          costPerKg: parseFloat(costPerKg),
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating pricing config:', error);
    return NextResponse.json({ error: 'Failed to update pricing config' }, { status: 500 });
  }
}

