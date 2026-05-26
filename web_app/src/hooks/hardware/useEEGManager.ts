'use client';

import { eegApi } from '@/lib/api/eegApi';
import { EegStatus } from '@/types/hardware';
import { useCallback, useState } from 'react';

export function useEEGManager() {
  const [eegStatus, setEegStatus] = useState<EegStatus>({
    status: 'Searching...',
    name: 'Scanning USB ports...',
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
              ? 'Muse S (Bluetooth)'
              : 'EEG (Simulated)',
          signal: recording_mode === 'Real' ? 'High' : 'Perfect',
          latency: recording_mode === 'Real' ? '14ms' : '0ms',
        });
      } else {
        setEegStatus({
          status: 'Searching...',
          name: 'Looking for stream...',
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
    // In our new architecture, the backend handles Bluetooth/LSL pairing automatically.
    // We just poll the status.
    await detectEEG();
  }, [detectEEG]);
  const handleEegAction = useCallback(async () => {
    if (eegStatus.status === 'Connected') {
      setIsRefreshingEEG(true);
      await detectEEG();
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsRefreshingEEG(false);
    } else {
      await handlePairEEG();
    }
  }, [eegStatus.status, detectEEG, handlePairEEG]);

  return {
    eegStatus,
    isRefreshingEEG,
    detectEEG,
    handlePairEEG,
    handleEegAction,
  };
}
