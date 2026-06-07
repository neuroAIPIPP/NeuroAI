import { LucideIcon } from 'lucide-react';

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

export interface EegStatus {
  status: 'Connected' | 'Disconnected' | 'Searching...';
  name: string;
  signal: string;
  latency: string;
}

// WebUSB Type Definitions
export interface USBDevice {
  productName?: string;
  vendorId: number;
  productId: number;
}

export interface USB {
  getDevices(): Promise<USBDevice[]>;
  requestDevice(options: {
    filters: { vendorId?: number; productId?: number }[];
  }): Promise<USBDevice>;
  onconnect: ((ev: Event) => void) | null;
  ondisconnect: ((ev: Event) => void) | null;
}

export interface ExtendedNavigator extends Navigator {
  usb?: USB;
}
