'use client';

import { EegStatus, ExtendedNavigator } from '@/types/hardware';
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
    const nav = navigator as ExtendedNavigator;
    try {
      if (!nav.usb) {
        setEegStatus({
          status: 'Disconnected',
          name: 'USB API not supported',
          signal: 'N/A',
          latency: 'N/A',
        });
        return;
      }

      const devices = await nav.usb.getDevices();
      if (devices.length > 0) {
        setEegStatus({
          status: 'Connected',
          name: devices[0].productName || 'USB EEG Device',
          signal: 'High',
          latency: '14ms',
        });
      } else {
        setEegStatus({
          status: 'Disconnected',
          name: 'No USB device paired',
          signal: 'N/A',
          latency: 'N/A',
        });
      }
    } catch (error) {
      console.error('EEG detection error:', error);
    }
  }, []);

  const handlePairEEG = useCallback(async () => {
    const nav = navigator as ExtendedNavigator;
    try {
      if (!nav.usb) return;
      const device = await nav.usb.requestDevice({ filters: [] });
      if (device) {
        setEegStatus({
          status: 'Connected',
          name: device.productName || 'USB EEG Device',
          signal: 'High',
          latency: '14ms',
        });
      }
    } catch (error) {
      console.error('Pairing cancelled or failed:', error);
    }
  }, []);

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
