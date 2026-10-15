'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

// A canvas cannot prerender, hence `ssr: false`: the chunk loads after
// hydration, never in the initial payload. It does load on every browser
// though — gating the mount on `navigator.gpu` also denied Three.js its own
// WebGL2 fallback, which left browsers without WebGPU staring at the poster.
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
 * Mounts the city scene as the page's backdrop, on WebGPU where it exists and
 * on the WebGL2 fallback where it does not. The wrapper always renders: its
 * gradient is what shows while the scene's chunk loads, and if the canvas
 * cannot start at all.
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
      <CityScene animate={!prefersReducedMotion} forceWebGL={!supportsWebGpu} />
    </div>
  );
}
