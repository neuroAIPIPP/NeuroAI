'use client';

import { useHardware } from '@/providers/HardwareProvider';

export function useEEGHeadset() {
  const {
    eegStatus,
    isRefreshingEEG,
    detectEEG,
    handlePairEEG,
    handleEegAction,
  } = useHardware();

  return {
    eegStatus,
    isRefreshingEEG,
    detectEEG,
    handlePairEEG,
    handleEegAction,
  };
}
