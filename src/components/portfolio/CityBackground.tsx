'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

// Loaded only once `navigator.gpu` answers, so a browser without WebGPU never
// downloads Three.js. A canvas cannot prerender either, hence `ssr: false`.
const CityScene = dynamic(
  async () => {
    const scene = await import('./CityScene');

    return scene.CityScene;
  },
  { ssr: false },
);

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Subscribes to nothing: WebGPU support cannot change during a page's life.
 * @returns A no-op unsubscribe.
 */
function subscribeToNothing() {
  return () => {
    // WebGPU availability is fixed for the lifetime of the document.
  };
}

/**
 * Reads whether this browser exposes WebGPU.
 * @returns True when `navigator.gpu` exists.
 */
function getWebGpuSnapshot() {
  return 'gpu' in navigator;
}

/**
 * Reports WebGPU as missing while rendering on the server.
 * @returns Always false, so the server markup is the CSS poster alone.
 */
function getServerWebGpuSnapshot() {
  return false;
}

/**
 * Subscribes to changes in the reduced-motion preference.
 * @param callback - Invoked whenever the preference flips.
 * @returns The matching unsubscribe.
 */
function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);

  query.addEventListener('change', callback);

  return () => {
    query.removeEventListener('change', callback);
  };
}

/**
 * Reads the current reduced-motion preference.
 * @returns True when the visitor asked for reduced motion.
 */
function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Assumes reduced motion on the server, so no loop is promised before the client answers.
 * @returns Always true.
 */
function getServerReducedMotionSnapshot() {
  return true;
}

/**
 * Mounts the WebGPU city behind the hexagon grid, or leaves its CSS poster in place.
 * The wrapper always renders: its gradient is the backdrop for browsers without
 * WebGPU and the placeholder while the scene's chunk loads.
 * @returns The fixed background layer.
 */
export function CityBackground() {
  const supportsWebGpu = useSyncExternalStore(
    subscribeToNothing,
    getWebGpuSnapshot,
    getServerWebGpuSnapshot,
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  return (
    <div aria-hidden="true" className="city-bg">
      {supportsWebGpu ? <CityScene animate={!prefersReducedMotion} /> : null}
    </div>
  );
}
