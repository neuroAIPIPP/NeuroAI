import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Landmark,
  createSmoothingBuffer,
  detectFocus,
  detectGazeDirection,
  extractPupilCoordinates,
  isLandmarkStable,
} from '../utils/eyeTrackingUtils';
import {
  ScreenRegion,
  createGazeSmoothingBuffer,
  getScreenRegion,
} from '../utils/webgazerUtils';

export interface TrackingData {
  isFocused: boolean;
  gazeDirection: string;
  screenX: number | null;
  screenY: number | null;
  screenRegion: ScreenRegion | null;
  leftPupilX?: number | null;
  leftPupilY?: number | null;
  rightPupilX?: number | null;
  rightPupilY?: number | null;
}

export function useEyeTracking(
  mode: 'mediapipe' | 'webgazer' | 'combined' = 'combined',
) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceMeshRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const webgazerRef = useRef<any>(null);

  const smoothingBufferRef = useRef(createSmoothingBuffer(10));
  const gazeSmoothingBufferRef = useRef(createGazeSmoothingBuffer());
  const previousLandmarksRef = useRef<Landmark[] | null>(null);

  const currentWebGazerDataRef = useRef<{ x: number; y: number } | null>(null);

  const isTrackingRef = useRef(false);

  // Initialize MediaPipe
  const initMediaPipe = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).FaceMesh) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
          'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const FaceMesh = (window as any).FaceMesh;

    const faceMesh = new FaceMesh({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshRef.current = faceMesh;
    return faceMesh;
  };

  // Initialize WebGazer
  const initWebGazer = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).webgazer) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
          'https://cdn.jsdelivr.net/npm/webgazer@2.1.30/dist/webgazer.js';
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webgazer = (window as any).webgazer;
    webgazerRef.current = webgazer;

    webgazer
      .showVideo(false)
      .showFaceOverlay(false)
      .showFaceFeedbackBox(false)
      .showPredictionPoints(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webgazer.setGazeListener((data: any) => {
      if (data == null) return;
      const smoothed = gazeSmoothingBufferRef.current.add({
        x: data.x,
        y: data.y,
      });
      currentWebGazerDataRef.current = smoothed;
    });

    try {
      await webgazer.begin();
    } catch (err) {
      try {
        webgazer.end();
      } catch {
        /* ignore */
      }
      throw err;
    }
    return webgazer;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onResults = useCallback((results: any) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0] as Landmark[];

      if (
        previousLandmarksRef.current &&
        !isLandmarkStable(landmarks, previousLandmarksRef.current)
      ) {
        previousLandmarksRef.current = landmarks;
        return;
      }
      previousLandmarksRef.current = landmarks;

      const pupils = extractPupilCoordinates(landmarks);
      if (pupils) {
        const smoothedPupils = smoothingBufferRef.current.add(pupils);
        const focused = detectFocus(smoothedPupils, landmarks);
        const gazeDir = detectGazeDirection(landmarks, smoothedPupils);

        const webGazerData = currentWebGazerDataRef.current;
        setTrackingData({
          isFocused: focused,
          gazeDirection: gazeDir,
          screenX: webGazerData?.x ?? null,
          screenY: webGazerData?.y ?? null,
          screenRegion: webGazerData
            ? getScreenRegion(webGazerData.x, webGazerData.y)
            : null,
          leftPupilX: smoothedPupils.left.x,
          leftPupilY: smoothedPupils.left.y,
          rightPupilX: smoothedPupils.right.x,
          rightPupilY: smoothedPupils.right.y,
        });
      }
    }
  }, []);

  const startTracking = async (
    existingVideoElement?: HTMLVideoElement | null,
  ) => {
    if (isTrackingRef.current) return;
    try {
      setError(null);

      let stream: MediaStream | null = null;
      let videoEl: HTMLVideoElement | null = null;

      // 1. If WebGazer is used, try to initialize it (non-critical — we can fall back to MediaPipe only)
      if (mode === 'webgazer' || mode === 'combined') {
        try {
          const webgazerInstance = await initWebGazer();
          const webgazerVideo = webgazerInstance.getVideoElement();
          if (webgazerVideo && webgazerVideo.srcObject) {
            stream = webgazerVideo.srcObject as MediaStream;
            videoEl = webgazerVideo;

            // Pipe WebGazer stream to our UI video element
            if (existingVideoElement) {
              existingVideoElement.srcObject = stream;
              existingVideoElement
                .play()
                .catch((e) => console.error('Error playing UI video:', e));
            }
          }
        } catch (wgErr) {
          console.warn(
            '[Eye Tracking] WebGazer failed to load, falling back to MediaPipe only:',
            wgErr,
          );
          // Continue without WebGazer — we'll use getUserMedia below
        }
      }

      // 2. Fallback to manual getUserMedia if WebGazer is not active or didn't provide a stream
      if (!stream) {
        const localVideo =
          existingVideoElement || document.createElement('video');
        localVideo.autoplay = true;
        localVideo.playsInline = true;

        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        localVideo.srcObject = localStream;
        await new Promise<void>((resolve) => {
          localVideo.onloadedmetadata = () => resolve();
        });

        stream = localStream;
        videoEl = localVideo;
      }

      cameraVideoRef.current = videoEl;
      isTrackingRef.current = true;
      setIsTracking(true);

      // 3. Initialize MediaPipe FaceMesh using the shared camera feed
      if (mode === 'mediapipe' || mode === 'combined') {
        const faceMesh = await initMediaPipe();
        faceMesh.onResults(onResults);

        const detectFrame = async () => {
          if (
            faceMeshRef.current &&
            cameraVideoRef.current &&
            isTrackingRef.current
          ) {
            try {
              await faceMeshRef.current.send({ image: cameraVideoRef.current });
            } catch (err) {
              console.error('Detection error:', err);
            }
            if (isTrackingRef.current) {
              requestAnimationFrame(detectFrame);
            }
          }
        };
        requestAnimationFrame(detectFrame);
      }
    } catch (err) {
      console.error('Eye tracking start failure:', err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Failed to start eye tracking — check camera permissions';
      setError(message);
      stopTracking();
    }
  };

  const stopTracking = () => {
    isTrackingRef.current = false;
    setIsTracking(false);
    setTrackingData(null);

    // If WebGazer is active, let webgazer.end() handle stream cleanup.
    // Only manually stop tracks when WebGazer is NOT managing the stream.
    const webgazerActive = !!webgazerRef.current;

    if (!webgazerActive && cameraVideoRef.current?.srcObject) {
      const stream = cameraVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
        faceMeshRef.current = null;
      }
    } catch {
      // Already closed
    }

    try {
      if (webgazerRef.current) {
        webgazerRef.current.end();
        webgazerRef.current = null;
      }
    } catch {
      // Already ended
    }

    cameraVideoRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    isTracking,
    trackingData,
    error,
    startTracking,
    stopTracking,
  };
}
