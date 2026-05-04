'use client';

import { useHardware } from '@/providers/HardwareProvider';

export function useCameraDetection() {
  const {
    cameraStatus,
    isPreviewing,
    lensVisibility,
    setLensVisibility,
    videoRef,
    canvasRef,
    detectCamera,
    togglePreview,
  } = useHardware();

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
