'use client';

import { useCameraManager } from '@/hooks/hardware/useCameraManager';
import { useEEGManager } from '@/hooks/hardware/useEEGManager';
import {
  CameraStatus,
  EegStatus,
  ExtendedNavigator,
  LensVisibilityStatus,
} from '@/types/hardware';
import React, { ReactNode, createContext, useContext, useEffect } from 'react';

interface HardwareContextType {
  cameraStatus: CameraStatus;
  eegStatus: EegStatus;
  lensVisibility: LensVisibilityStatus;
  isPreviewing: boolean;
  isRefreshing: boolean;
  isRefreshingEEG: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  setLensVisibility: (status: LensVisibilityStatus) => void;
  detectCamera: () => Promise<void>;
  detectEEG: () => Promise<void>;
  handlePairEEG: () => Promise<void>;
  togglePreview: () => Promise<void>;
  handleEegAction: () => Promise<void>;
  setIsRefreshing: (val: boolean) => void;
}

const HardwareContext = createContext<HardwareContextType | undefined>(
  undefined,
);

export function HardwareProvider({ children }: { children: ReactNode }) {
  const camera = useCameraManager();
  const eeg = useEEGManager();

  // Lifecycle effects for global monitoring
  useEffect(() => {
    const init = async () => {
      await Promise.all([camera.detectCamera(), eeg.detectEEG()]);
    };
    init();

    const nav = navigator as ExtendedNavigator;
    navigator.mediaDevices.addEventListener(
      'devicechange',
      camera.detectCamera,
    );
    if (nav.usb) {
      nav.usb.onconnect = eeg.detectEEG;
      nav.usb.ondisconnect = eeg.detectEEG;
    }
    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        camera.detectCamera,
      );
      if (nav.usb) {
        nav.usb.onconnect = null;
        nav.usb.ondisconnect = null;
      }
    };
  }, [camera.detectCamera, eeg.detectEEG]);

  return (
    <HardwareContext.Provider
      value={{
        ...camera,
        ...eeg,
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
}

export function useHardware() {
  const context = useContext(HardwareContext);
  if (context === undefined) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
}
