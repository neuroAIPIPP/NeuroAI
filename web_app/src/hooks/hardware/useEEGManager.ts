'use client';

import { eegApi } from '@/lib/api/eegApi';
import { EegStatus } from '@/types/hardware';
import { useCallback, useState } from 'react';

export function useEEGManager() {
  const [eegStatus, setEegStatus] = useState<EegStatus>({
    status: 'Searching...',
    name: 'Mencari Stream LSL...',
    signal: 'N/A',
    latency: 'N/A',
  });
  const [isRefreshingEEG, setIsRefreshingEEG] = useState(false);

  const detectEEG = useCallback(async () => {
    try {
      const { recording_mode } = await eegApi.getStatus();

      if (recording_mode === null) {
        setEegStatus({
          status: 'Disconnected',
          name: 'Backend Offline',
          signal: 'N/A',
          latency: 'N/A',
        });
      } else if (recording_mode === 'Real' || recording_mode === 'Mock') {
        setEegStatus({
          status: 'Connected',
          name:
            recording_mode === 'Real'
              ? 'Muse S (LSL Stream)'
              : 'EEG (Simulated)',
          signal: recording_mode === 'Real' ? 'High' : 'Perfect',
          latency: recording_mode === 'Real' ? '< 20ms' : '0ms',
        });
      } else {
        setEegStatus({
          status: 'Searching...',
          name: 'Looking for LSL stream...',
          signal: 'N/A',
          latency: 'N/A',
        });
      }
    } catch (error) {
      console.error('EEG detection error:', error);
      setEegStatus({
        status: 'Disconnected',
        name: 'Backend Error',
        signal: 'N/A',
        latency: 'N/A',
      });
    }
  }, []);
  const handlePairEEG = useCallback(async () => {
    // Karena kita memakai muselsl, pairing dilakukan di terminal (backend).
    // Tombol di frontend hanya me-refresh deteksi status.
    setIsRefreshingEEG(true);
    await detectEEG();
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshingEEG(false);
  }, [detectEEG]);

  const handleEegAction = useCallback(async () => {
    setIsRefreshingEEG(true);
    await detectEEG();
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsRefreshingEEG(false);
  }, [detectEEG]);

  return {
    eegStatus,
    isRefreshingEEG,
    detectEEG,
    handlePairEEG,
    handleEegAction,
  };
}
