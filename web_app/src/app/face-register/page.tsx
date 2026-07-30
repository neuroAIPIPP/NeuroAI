'use client';

import Navbar from '@/components/Navbar';
import FaceCameraSection from '@/components/face-register/FaceCameraSection';
import FaceRegisterHeader from '@/components/face-register/FaceRegisterHeader';
import RegisteredFacesSection from '@/components/face-register/RegisteredFacesSection';
import { FaceListResponse, faceApi } from '@/lib/api/faceApi';
import { authClient } from '@/lib/auth-client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function FaceRegisterPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || '';
  const displayName =
    session?.user?.name || session?.user?.email || 'Memuat Data...';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [faces, setFaces] = useState<FaceListResponse>({
    total_faces: 0,
    names: [],
    last_saved: null,
  });
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error' | '';
    text: string;
  }>({ type: '', text: '' });
  const [backendAvailable, setBackendAvailable] = useState(true);

  const fetchFaces = useCallback(async () => {
    if (!userId) return; // Wait until session is loaded

    const list = await faceApi.listFaces();

    // Filter the list to only include the current user's ID
    const userFaces = list.names.filter((n) => n === userId);
    const filteredList = {
      ...list,
      names: userFaces,
      total_faces: userFaces.length,
    };

    if (list.names.length === 0 && list.total_faces === 0) {
      // Backend might be offline or just empty. Let's check status.
      const status = await faceApi.getStatus();
      if (!status.face_recognition_available) {
        setBackendAvailable(false);
      } else {
        setBackendAvailable(true);
        setFaces(filteredList);
      }
    } else {
      setBackendAvailable(true);
      setFaces(filteredList);
    }
  }, [userId]);

  useEffect(() => {
    fetchFaces();
  }, [fetchFaces]);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (e) {
        console.error('Camera error:', e);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCaptureAndRegister = async () => {
    if (!userId) {
      setStatusMsg({
        type: 'error',
        text: 'Data sesi belum siap, silakan tunggu sebentar.',
      });
      return;
    }
    if (!videoRef.current) return;

    setIsRegistering(true);
    setStatusMsg({ type: '', text: '' });

    // Capture frame to canvas
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert to file
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setIsRegistering(false);
          setStatusMsg({ type: 'error', text: 'Gagal mengambil gambar' });
          return;
        }

        const file = new File([blob], `${userId}.jpg`, { type: 'image/jpeg' });
        const result = await faceApi.registerFace(userId, file);

        setIsRegistering(false);
        if (result.status === 'success') {
          setStatusMsg({
            type: 'success',
            text: `Wajah untuk ${displayName} berhasil didaftarkan!`,
          });
          fetchFaces();
        } else {
          setStatusMsg({ type: 'error', text: result.message });
        }
      },
      'image/jpeg',
      0.9,
    );
  };

  const handleDelete = async (faceName: string) => {
    const result = await faceApi.deleteFace(faceName);
    if (result.status === 'success') {
      fetchFaces();
    } else {
      alert(`Gagal menghapus: ${result.message}`);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <FaceRegisterHeader backendAvailable={backendAvailable} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <FaceCameraSection
            videoRef={videoRef}
            stream={stream}
            displayName={displayName}
            isRegistering={isRegistering}
            backendAvailable={backendAvailable}
            statusMsg={statusMsg}
            onRegister={handleCaptureAndRegister}
          />

          <RegisteredFacesSection
            faces={faces}
            displayName={displayName}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  );
}
