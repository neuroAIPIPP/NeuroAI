import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      startTime,
      endTime,
      status,
      eegRecording,
      eyeTrackingSessions,
      videoRatings,
      faceVerifications,
    } = body;

    // Menyimpan data secara transaksional di PostgreSQL
    const savedSession = await prisma.$transaction(async (tx) => {
      // 1. Simpan StudySession
      const studySession = await tx.studySession.create({
        data: {
          userId,
          startTime: startTime ? new Date(startTime) : new Date(),
          endTime: endTime ? new Date(endTime) : new Date(),
          status: status || 'completed',
        },
      });

      // 2. Simpan EegRecording jika ada
      if (eegRecording && eegRecording.filePath) {
        await tx.eegRecording.create({
          data: {
            sessionId: studySession.id,
            filePath: eegRecording.filePath,
            startTime: eegRecording.startTime
              ? new Date(eegRecording.startTime)
              : new Date(),
            endTime: eegRecording.endTime
              ? new Date(eegRecording.endTime)
              : new Date(),
          },
        });
      }

      // 3. Simpan EyeTrackingSession (bisa beberapa video dalam satu sesi)
      if (eyeTrackingSessions && Array.isArray(eyeTrackingSessions)) {
        for (const et of eyeTrackingSessions) {
          // Simpan session selama ada videoTitle (filePath bisa kosong jika hanya client-side tracking)
          if (et.videoTitle) {
            await tx.eyeTrackingSession.create({
              data: {
                sessionId: studySession.id,
                videoTitle: et.videoTitle || '',
                mode: et.mode || 'combined',
                filePath: et.filePath || '',
                totalDataPoints: et.totalDataPoints || 0,
                startTime: et.startTime ? new Date(et.startTime) : new Date(),
                endTime: et.endTime ? new Date(et.endTime) : new Date(),
              },
            });
          }
        }
      }

      // 4. Simpan VideoRating jika ada survey rating yang dijawab
      if (videoRatings && Array.isArray(videoRatings)) {
        for (const vr of videoRatings) {
          await tx.videoRating.create({
            data: {
              sessionId: studySession.id,
              videoTitle: vr.videoTitle,
              rating: parseInt(vr.rating.toString(), 10),
              timestamp: vr.timestamp ? new Date(vr.timestamp) : new Date(),
            },
          });
        }
      }

      // 5. Simpan FaceVerification
      if (faceVerifications && Array.isArray(faceVerifications)) {
        for (const fv of faceVerifications) {
          await tx.faceVerification.create({
            data: {
              sessionId: studySession.id,
              timestamp: fv.timestamp ? new Date(fv.timestamp) : new Date(),
              personName: fv.personName,
              confidence: parseFloat(fv.confidence.toString()),
              isVerified: fv.isVerified,
            },
          });
        }
      }

      return studySession;
    });

    console.log(
      `[Session Save] Berhasil menyimpan sesi ${savedSession.id} untuk user ${userId}`,
    );

    return NextResponse.json({
      status: 'success',
      sessionId: savedSession.id,
    });
  } catch (error: unknown) {
    console.error('[Session Save] Gagal menyimpan sesi:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Gagal menyimpan data ke database',
      },
      { status: 500 },
    );
  }
}
