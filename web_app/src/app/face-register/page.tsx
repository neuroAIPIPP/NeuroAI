'use client';

import Navbar from '@/components/Navbar';
import { FaceListResponse, faceApi } from '@/lib/api/faceApi';
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  RefreshCw,
  ScanFace,
  Trash2,
  UserPlus,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function FaceRegisterPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [name, setName] = useState('');
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
    const list = await faceApi.listFaces();
    if (list.names.length === 0 && list.total_faces === 0) {
      // Backend might be offline or just empty. Let's check status.
      const status = await faceApi.getStatus();
      if (!status.face_recognition_available) {
        setBackendAvailable(false);
      } else {
        setBackendAvailable(true);
        setFaces(list);
      }
    } else {
      setBackendAvailable(true);
      setFaces(list);
    }
  }, []);

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
    if (!name.trim()) {
      setStatusMsg({ type: 'error', text: 'Nama harus diisi' });
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

        const file = new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
        const result = await faceApi.registerFace(name, file);

        setIsRegistering(false);
        if (result.status === 'success') {
          setStatusMsg({
            type: 'success',
            text: `Wajah ${result.name} berhasil didaftarkan!`,
          });
          setName('');
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
    <main className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <div className="pt-28 max-w-5xl mx-auto px-6 pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2A3441] flex items-center gap-3">
              <ScanFace className="w-8 h-8 text-[#8EACCD]" />
              Face Registration
            </h1>
            <p className="text-gray-500 mt-2">
              Daftarkan wajah Anda untuk verifikasi otomatis saat sesi belajar.
            </p>
          </div>

          {!backendAvailable && (
            <div className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg flex items-center gap-2 font-medium text-sm">
              <AlertTriangle className="w-4 h-4" />
              Backend Offline
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold text-[#2A3441] mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" /> Live Camera
            </h2>

            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video mb-6 flex-1 flex items-center justify-center border border-gray-200">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
              {!stream && (
                <p className="text-gray-400 font-medium">
                  Meminta akses kamera...
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8EACCD] focus:border-transparent transition-all"
                  disabled={isRegistering || !backendAvailable}
                />
              </div>

              {statusMsg.text && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                >
                  {statusMsg.type === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {statusMsg.text}
                </div>
              )}

              <button
                onClick={handleCaptureAndRegister}
                disabled={
                  isRegistering || !name.trim() || !stream || !backendAvailable
                }
                className="w-full py-3.5 bg-[#8EACCD] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#7A9BBF] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isRegistering ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />{' '}
                    Mendaftarkan...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" /> Capture & Register
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Registered Faces Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#2A3441] flex items-center gap-2">
                <ScanFace className="w-5 h-5" /> Registered Faces
              </h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                {faces.total_faces} Terdaftar
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {faces.names.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <ScanFace className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium text-sm">
                    Belum ada wajah yang terdaftar.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {faces.names.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#8EACCD]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8EACCD]/10 text-[#8EACCD] rounded-full flex items-center justify-center font-bold text-lg">
                          {n.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-bold text-[#2A3441]">{n}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(n)}
                        className="p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                        title="Hapus wajah"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
