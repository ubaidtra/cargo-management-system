import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalCargo = await prisma.cargo.count();
    
    const revenueResult = await prisma.cargo.aggregate({
      _sum: {
        cost: true,
      },
      where: {
        paymentStatus: 'PAID',
      },
    });

    const totalRevenue = revenueResult._sum.cost || 0;

    const recentTransactions = await prisma.cargo.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      totalCargo,
      totalRevenue,
      recentTransactions,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

