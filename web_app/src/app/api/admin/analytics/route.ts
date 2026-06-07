import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all analyses from all users
    const analyses = await prisma.concentrationAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to recent 100
      include: {
        session: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Calculate aggregate stats
    const totalSessions = analyses.length;
    const avgConcentration =
      totalSessions > 0
        ? analyses.reduce((sum, a) => sum + a.concentrationScore, 0) /
          totalSessions
        : 0;

    // Map to frontend expected AnalysisData interface
    const formattedAnalyses = analyses.map((a) => ({
      ...a,
      user: {
        name: a.session.user.name || 'Platform User',
        email: a.session.user.email || 'user@neuroai.id',
      },
    }));

    return NextResponse.json({
      status: 'success',
      analyses: formattedAnalyses,
      stats: {
        totalSessions,
        avgConcentration: Math.round(avgConcentration * 100) / 100,
      },
    });
  } catch (error: unknown) {
    console.error('[Admin Analytics GET] Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve admin analyses',
      },
      { status: 500 },
    );
  }
}
