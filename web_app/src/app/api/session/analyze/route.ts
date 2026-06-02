import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/session/analyze
 * Trigger analisis konsentrasi untuk session tertentu.
 *
 * Body: { sessionId: string }
 *
 * Flow:
 *   1. Ambil session data dari DB (file paths, metadata)
 *   2. Panggil FastAPI /analysis/analyze dengan file paths
 *   3. Simpan hasil analisis ke ConcentrationAnalysis table
 *   4. Return hasil ke frontend
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 },
      );
    }

    // 1. Get session data from DB
    const studySession = await prisma.studySession.findUnique({
      where: { id: sessionId },
      include: {
        eegRecordings: true,
        eyeTrackingSessions: true,
        videoRatings: true,
        faceVerifications: true,
      },
    });

    if (!studySession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Ensure the session belongs to the current user
    if (studySession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Collect file paths
    const eyeTrackingFiles = studySession.eyeTrackingSessions
      .map((et) => et.filePath)
      .filter((fp): fp is string => !!fp && fp.length > 0);

    const videoTitles = studySession.eyeTrackingSessions.map(
      (et) => et.videoTitle || 'Unknown',
    );

    const eegFile =
      studySession.eegRecordings.length > 0
        ? studySession.eegRecordings[0].filePath
        : null;

    // Calculate face verification ratio
    const faceChecks = studySession.faceVerifications || [];
    const totalChecks = faceChecks.length;
    const matchedChecks = faceChecks.filter((fv) => fv.isVerified).length;
    const faceVerificationRatio =
      totalChecks > 0 ? (matchedChecks / totalChecks) * 100 : null;

    // 3. Call FastAPI analysis endpoint
    let analysisResult;
    try {
      const response = await fetch(`${AI_BACKEND_URL}/analysis/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eye_tracking_files: eyeTrackingFiles,
          eeg_file: eegFile,
          video_titles: videoTitles,
          mata_kuliah: null, // Can be added when course context is available
          generate_ai_insights: true,
          face_verification_ratio: faceVerificationRatio,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Analyze] FastAPI error:', response.status, errorText);
        return NextResponse.json(
          {
            error: `Analysis service error: ${response.status}`,
            details: errorText,
          },
          { status: 502 },
        );
      }

      analysisResult = await response.json();
    } catch (fetchError) {
      console.error('[Analyze] Failed to reach analysis backend:', fetchError);
      return NextResponse.json(
        {
          error:
            'Analysis backend unreachable. Make sure FastAPI is running on ' +
            AI_BACKEND_URL,
        },
        { status: 503 },
      );
    }

    // 4. Save analysis to database
    const overall = analysisResult.overall || {};
    const eegAnalysis = analysisResult.eeg_analysis || {};
    const aiInsights = analysisResult.ai_insights || {};
    const breakdown = overall.breakdown || {};

    // Delete existing analysis for this session (re-analyze support)
    await prisma.concentrationAnalysis.deleteMany({
      where: { sessionId },
    });

    const savedAnalysis = await prisma.concentrationAnalysis.create({
      data: {
        sessionId,
        concentrationScore: overall.concentration_percentage || 0,
        eyeTrackingScore: overall.eye_tracking_score || 0,
        eegScore: overall.eeg_score || 0,
        focusPercentage: breakdown.focus_percentage || 0,
        gazeDistribution:
          analysisResult.per_video?.[0]?.eye_tracking?.gaze_distribution || {},
        pupilStability: breakdown.pupil_stability || 0,
        attentionIndex: breakdown.attention_index || null,
        relaxationIndex: eegAnalysis.relaxation_index || null,
        bandPowers: eegAnalysis.band_powers || null,
        aiSummary: aiInsights.summary || null,
        aiStrengths: aiInsights.strengths || null,
        aiImprovements: aiInsights.improvements || null,
        aiPatterns: aiInsights.patterns || null,
        aiTips: aiInsights.tips || null,
        aiGenerated: aiInsights.generated || false,
        videoTitle: videoTitles.join(', ') || null,
        analysisMode: 'post-session',
        eegMode: eegAnalysis.is_mock
          ? 'Mock'
          : eegAnalysis.total_samples > 0
            ? 'Real'
            : null,
        confidenceLevel: overall.confidence_level || 'low',
      },
    });

    console.log(
      `[Analyze] Analysis saved for session ${sessionId}: ${overall.concentration_percentage}% concentration`,
    );

    return NextResponse.json({
      status: 'success',
      analysisId: savedAnalysis.id,
      analysis: {
        overall: analysisResult.overall,
        per_video: analysisResult.per_video,
        eeg_analysis: analysisResult.eeg_analysis,
        session_summary: analysisResult.session_summary,
        ai_insights: analysisResult.ai_insights,
      },
    });
  } catch (error: unknown) {
    console.error('[Analyze] Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to analyze session',
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/session/analyze?sessionId=xxx
 * Get existing analysis results from database (no re-compute).
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get('sessionId');

    if (sessionId) {
      // Get analysis for specific session
      const analysis = await prisma.concentrationAnalysis.findFirst({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
      });

      if (!analysis) {
        return NextResponse.json(
          { error: 'No analysis found for this session' },
          { status: 404 },
        );
      }

      return NextResponse.json({ status: 'success', analysis });
    }

    // Get all analyses for current user (latest first)
    const analyses = await prisma.concentrationAnalysis.findMany({
      where: {
        session: {
          userId: session.user.id,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        session: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
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

    return NextResponse.json({
      status: 'success',
      analyses,
      stats: {
        totalSessions,
        avgConcentration: Math.round(avgConcentration * 100) / 100,
      },
    });
  } catch (error: unknown) {
    console.error('[Analyze GET] Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve analyses',
      },
      { status: 500 },
    );
  }
}
