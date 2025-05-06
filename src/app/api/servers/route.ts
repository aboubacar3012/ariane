import { NextResponse } from 'next/server';
import prisma from '../../../../prisma';



export async function GET() {
  try {
    const servers = await prisma.vPS.findMany({
      include: {
        specs: true // Inclure les spécifications de chaque serveur
      }
    });

    return NextResponse.json({ 
      success: true,
      data: servers
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching VPS servers:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch servers' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}