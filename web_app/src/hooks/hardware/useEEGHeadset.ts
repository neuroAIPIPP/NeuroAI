'use client';

import { useEffect, useState } from 'react';

// WebUSB Type Definitions
interface USBDevice {
  productName?: string;
  vendorId: number;
  productId: number;
}

interface USB {
  getDevices(): Promise<USBDevice[]>;
  requestDevice(options: {
    filters: { vendorId?: number; productId?: number }[];
  }): Promise<USBDevice>;
  onconnect: ((ev: Event) => void) | null;
  ondisconnect: ((ev: Event) => void) | null;
}

interface ExtendedNavigator extends Navigator {
  usb?: USB;
}

export interface EegStatus {
  status: 'Connected' | 'Disconnected' | 'Searching...';
  name: string;
  signal: string;
  latency: string;
}

export function useEEGHeadset() {
  const [eegStatus, setEegStatus] = useState<EegStatus>({
    status: 'Searching...',
    name: 'Scanning USB ports...',
    signal: 'N/A',
    latency: 'N/A',
  });
  const [isRefreshingEEG, setIsRefreshingEEG] = useState(false);

  const detectEEG = async () => {
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
  };

  const handlePairEEG = async () => {
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
  };

  const handleEegAction = async () => {
    if (eegStatus.status === 'Connected') {
      setIsRefreshingEEG(true);
      await detectEEG();
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsRefreshingEEG(false);
    } else {
      await handlePairEEG();
    }
  };

  useEffect(() => {
    const init = async () => {
      await detectEEG();
    };
    init();

    const nav = navigator as ExtendedNavigator;
    if (nav.usb) {
      nav.usb.onconnect = detectEEG;
      nav.usb.ondisconnect = detectEEG;
    }
    return () => {
      if (nav.usb) {
        nav.usb.onconnect = null;
        nav.usb.ondisconnect = null;
      }
    };
  }, []);

  return {
    eegStatus,
    isRefreshingEEG,
    detectEEG,
    handlePairEEG,
    handleEegAction,
  };
}
