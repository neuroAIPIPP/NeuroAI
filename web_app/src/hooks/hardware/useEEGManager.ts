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
      const { recording_mode, is_stream_active } = await eegApi.getStatus();

      if (recording_mode === null) {
        setEegStatus({
          status: 'Disconnected',
          name: 'Backend Offline',
          signal: 'N/A',
          latency: 'N/A',
        });
      } else if (
        is_stream_active ||
        recording_mode === 'Real' ||
        recording_mode === 'Mock'
      ) {
        setEegStatus({
          status: 'Connected',
          name:
            recording_mode === 'Mock'
              ? 'EEG (Simulated)'
              : 'Muse S (LSL Stream Active)',
          signal: recording_mode === 'Mock' ? 'Perfect' : 'High',
          latency: recording_mode === 'Mock' ? '0ms' : '< 20ms',
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
    setIsRefreshingEEG(true);
    setEegStatus((prev) => ({
      ...prev,
      status: 'Searching...',
      name: 'Scanning for Bluetooth devices...',
    }));

    try {
      // 1. Scan devices
      const scanRes = await eegApi.scanDevices();
      if (scanRes.status === 'success' && scanRes.devices.length > 0) {
        const targetDevice = scanRes.devices[0];
        setEegStatus((prev) => ({
          ...prev,
          name: `Connecting to ${targetDevice.name}...`,
        }));

        // 2. Connect to the first found device
        const connectRes = await eegApi.connectDevice(targetDevice.address);
        if (
          connectRes.status === 'success' ||
          connectRes.status === 'already_streaming'
        ) {
          // Verify status
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await detectEEG();
        } else {
          setEegStatus((prev) => ({
            ...prev,
            status: 'Disconnected',
            name: 'Connection Failed',
          }));
        }
      } else {
        setEegStatus((prev) => ({
          ...prev,
          status: 'Disconnected',
          name: 'No Muse devices found nearby',
        }));
      }
    } catch (error) {
      console.error('Error during Muse pair:', error);
      setEegStatus((prev) => ({
        ...prev,
        status: 'Disconnected',
        name: 'Bluetooth Error',
      }));
    } finally {
      setIsRefreshingEEG(false);
    }
  }, [detectEEG]);

  const handleEegAction = useCallback(async () => {
    if (eegStatus.status === 'Connected') {
      // If already connected, maybe just refresh status
      setIsRefreshingEEG(true);
      await detectEEG();
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsRefreshingEEG(false);
    } else {
      // If disconnected, trigger pair
      await handlePairEEG();
    }
  }, [detectEEG, eegStatus.status, handlePairEEG]);

  return {
    eegStatus,
    isRefreshingEEG,
    detectEEG,
    handlePairEEG,
    handleEegAction,
  };
}
