'use client';

import { AlertCircle, Check, Clock, LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type LensVisibilityStatus =
  | 'Not Checked'
  | 'Clear'
  | 'Blocked / Covered'
  | 'Verifying...';

export interface CameraStatus {
  status: 'Connected' | 'Disconnected' | 'Permission Denied' | 'Checking...';
  name: string;
  icon: LucideIcon;
}

export function useCameraDetection() {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({
    status: 'Checking...',
    name: 'Scanning for devices...',
    icon: Clock,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [lensVisibility, setLensVisibility] =
    useState<LensVisibilityStatus>('Not Checked');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const detectCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput',
      );

      if (videoDevices.length > 0) {
        const hasLabels = videoDevices.some((d) => d.label);

        if (!hasLabels) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            stream.getTracks().forEach((track) => track.stop());

            const updatedDevices =
              await navigator.mediaDevices.enumerateDevices();
            const updatedVideoDevices = updatedDevices.filter(
              (device) => device.kind === 'videoinput',
            );
            setCameraStatus({
              status: 'Connected',
              name: updatedVideoDevices[0].label || 'Integrated Camera',
              icon: Check,
            });
          } catch (err: unknown) {
            const error = err as Error;
            if (error.name === 'NotAllowedError') {
              setCameraStatus({
                status: 'Permission Denied',
                name: 'Allow camera access in settings',
                icon: AlertCircle,
              });
            } else {
              setCameraStatus({
                status: 'Connected',
                name: 'Camera detected (Unknown)',
                icon: Check,
              });
            }
          }
        } else {
          setCameraStatus({
            status: 'Connected',
            name: videoDevices[0].label,
            icon: Check,
          });
        }
      } else {
        setCameraStatus({
          status: 'Disconnected',
          name: 'No camera found',
          icon: AlertCircle,
        });
      }
    } catch {
      setCameraStatus({
        status: 'Disconnected',
        name: 'Hardware error',
        icon: AlertCircle,
      });
    }
  };

  const togglePreview = async () => {
    if (isPreviewing) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsPreviewing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        setLensVisibility('Verifying...');
        setIsPreviewing(true);
      } catch (err) {
        console.error('Failed to start preview:', err);
      }
    }
  };

  // Assign stream to video element
  useEffect(() => {
    if (isPreviewing && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isPreviewing]);

  // Lens analysis loop
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (isPreviewing && videoRef.current) {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current && streamRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const videoTrack = streamRef.current.getVideoTracks()[0];

          if (videoTrack && (videoTrack.muted || !videoTrack.enabled)) {
            setLensVisibility('Blocked / Covered');
            return;
          }

          if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = 40;
            canvas.height = 30;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const data = imageData.data;

            let totalBrightness = 0;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              totalBrightness += (r + g + b) / 3;
            }

            const avgBrightness = totalBrightness / (data.length / 4);
            if (avgBrightness < 60) {
              setLensVisibility('Blocked / Covered');
            } else {
              setLensVisibility('Clear');
            }
          }
        }
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPreviewing]);

  useEffect(() => {
    const init = async () => {
      await detectCamera();
    };
    init();

    const mediaDevices = navigator.mediaDevices;
    mediaDevices.addEventListener('devicechange', detectCamera);
    return () => {
      mediaDevices.removeEventListener('devicechange', detectCamera);
    };
  }, []);

  return {
    cameraStatus,
    isPreviewing,
    lensVisibility,
    setLensVisibility,
    videoRef,
    canvasRef,
    detectCamera,
    togglePreview,
  };
}
