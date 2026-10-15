'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { InstancedMesh } from 'three';
import { Matrix4, PCFShadowMap } from 'three';
import { MeshBasicNodeMaterial, WebGPURenderer } from 'three/webgpu';
import {
  CLOUD_COLOR_NODE,
  CLOUD_OPACITY_NODE,
  MOON_COLOR_NODE,
  MOON_HALO_COLOR_NODE,
  MOON_HALO_OPACITY_NODE,
  RAIN_COLOR_NODE,
  RAIN_OPACITY_NODE,
  RAIN_POSITION_NODE,
  SKY_COLOR_NODE,
} from './rainNodes';

type CloudLayer = {
  position: [number, number, number];
  scale: [number, number, number];
};

/** Registers the node material as JSX so the module-scope graphs ride in as props. */
const NodeMaterial = extend(MeshBasicNodeMaterial);

/** Streaks in the air at once. Every one is placed by the vertex stage. */
const RAIN_COUNT = 1100;

/** Where the moon hangs, and how wide. Far enough back that cloud banks cross
 * in front of it rather than all sitting behind. */
const MOON_POSITION: [number, number, number] = [38, 41, -95];
const MOON_RADIUS = 9;

/** Cloud banks, placed by hand so they layer around the moon at several depths. */
const CLOUD_LAYERS: CloudLayer[] = [
  { position: [-34, 30, -62], scale: [96, 34, 1] },
  { position: [28, 35, -74], scale: [120, 40, 1] },
  { position: [6, 26, -44], scale: [72, 24, 1] },
  { position: [-52, 39, -88], scale: [110, 38, 1] },
  { position: [48, 28, -36], scale: [66, 22, 1] },
  { position: [0, 42, -104], scale: [160, 46, 1] },
  { position: [44, 46, -72], scale: [88, 30, 1] },
  { position: [-18, 48, -82], scale: [104, 32, 1] },
  { position: [62, 36, -58], scale: [78, 26, 1] },
  { position: [-66, 28, -50], scale: [84, 28, 1] },
  { position: [20, 52, -96], scale: [130, 36, 1] },
  { position: [-40, 22, -40], scale: [70, 22, 1] },
];

/**
 * Drifts the camera so the sky keeps a slow parallax with no input of its own.
 * @param props - `enabled` false parks the camera on its opening framing.
 * @returns Nothing; the component only drives the shared camera.
 */
function CameraDrift(props: { enabled: boolean }) {
  useFrame((state) => {
    const elapsed = props.enabled ? state.clock.elapsedTime : 0;

    state.camera.position.x = Math.sin(elapsed * 0.045) * 2.6;
    state.camera.position.y = 10 + Math.sin(elapsed * 0.031) * 0.7;
    state.camera.lookAt(0, 16, -50);
  });

  return null;
}

/**
 * Draws the whole downpour as one instanced mesh of streaks.
 * @returns The instanced rain.
 */
function Rain() {
  const mesh = useRef<InstancedMesh>(null);

  // A fresh InstancedMesh carries an all-zero matrix buffer, which would
  // collapse every streak onto the origin. The identities hand placement over
  // to `RAIN_POSITION_NODE`, and the mesh skips culling because its bounds no
  // longer describe where the vertex stage actually puts the drops.
  useLayoutEffect(() => {
    const instanced = mesh.current;

    if (!instanced) {
      return;
    }

    const identity = new Matrix4();

    for (let index = 0; index < RAIN_COUNT; index += 1) {
      instanced.setMatrixAt(index, identity);
    }

    instanced.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh args={[undefined, undefined, RAIN_COUNT]} frustumCulled={false} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <NodeMaterial
        colorNode={RAIN_COLOR_NODE}
        depthWrite={false}
        opacityNode={RAIN_OPACITY_NODE}
        positionNode={RAIN_POSITION_NODE}
        transparent
      />
    </instancedMesh>
  );
}

/**
 * Hangs the drifting cloud banks over the rain.
 * @returns One transparent plane per cloud bank.
 */
function Clouds() {
  return (
    <>
      {CLOUD_LAYERS.map((layer) => (
        <mesh
          key={`${layer.position[0]}:${layer.position[2]}`}
          position={layer.position}
          scale={layer.scale}
        >
          <planeGeometry args={[1, 1]} />
          <NodeMaterial
            colorNode={CLOUD_COLOR_NODE}
            depthWrite={false}
            opacityNode={CLOUD_OPACITY_NODE}
            transparent
          />
        </mesh>
      ))}
    </>
  );
}

/**
 * Hangs the moon in the sky, with a soft halo bleeding into the cloud bank.
 * The sphere is unit-sized and scaled up so its object-space coordinates stay
 * in `-1..1`, which is what keeps the crater noise at a predictable frequency.
 * @returns The moon and its glow.
 */
function Moon() {
  return (
    <>
      <mesh position={MOON_POSITION} scale={MOON_RADIUS}>
        <sphereGeometry args={[1, 48, 32]} />
        <NodeMaterial colorNode={MOON_COLOR_NODE} />
      </mesh>
      {/* Behind the sphere, so the glow never washes over the lit face. */}
      <mesh
        position={[MOON_POSITION[0], MOON_POSITION[1], MOON_POSITION[2] - MOON_RADIUS]}
        scale={MOON_RADIUS * 6}
      >
        <planeGeometry args={[1, 1]} />
        <NodeMaterial
          colorNode={MOON_HALO_COLOR_NODE}
          depthWrite={false}
          opacityNode={MOON_HALO_OPACITY_NODE}
          transparent
        />
      </mesh>
    </>
  );
}

/**
 * Fills the frustum behind everything with the sky gradient.
 * @returns The backdrop plane.
 */
function Sky() {
  return (
    <mesh position={[0, 20, -140]}>
      <planeGeometry args={[400, 190]} />
      <NodeMaterial colorNode={SKY_COLOR_NODE} />
    </mesh>
  );
}

/**
 * Asks for one render, so the reduced-motion build still paints its still frame.
 * @returns Nothing; the component only pokes the render loop.
 */
function FirstFrame() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  return null;
}

/**
 * Renders the backdrop: a gradient sky, drifting clouds and falling rain.
 * Nothing here is compute-bound and every material is a node material, so the
 * same scene runs on WebGPU's WebGL2 backend when the browser has no WebGPU.
 * @param props - `animate` false renders a single still frame instead of a loop; `forceWebGL` picks the WebGL2 backend.
 * @returns The canvas holding the scene.
 */
export function RainScene(props: { animate: boolean; forceWebGL: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 10, 38], fov: 48, near: 0.5, far: 320 }}
      dpr={[1, 1.5]}
      frameloop={props.animate ? 'always' : 'demand'}
      // The scene casts no shadows, but Fiber's `shadows` prop defaults to
      // `false`, and a boolean makes it set `shadowMap.type` to
      // `PCFSoftShadowMap` anyway — a type WebGPURenderer dropped, so it warns
      // on every single render. Passing the options object instead keeps the
      // shadow map off and names a type the renderer still knows.
      shadows={{ enabled: false, type: PCFShadowMap }}
      gl={async (defaults) => {
        if (!(defaults.canvas instanceof HTMLCanvasElement)) {
          throw new Error('The rain background needs a browser canvas');
        }

        // `requestAdapter` resolving to null is the usual reason WebGPU is
        // present yet unusable (no suitable GPU, acceleration switched off).
        // The renderer then falls back to WebGL2 without saying so, which is
        // indistinguishable on screen, so record the reason here.
        let adapterState = 'absent';

        if (navigator.gpu) {
          try {
            adapterState = (await navigator.gpu.requestAdapter()) ? 'ok' : 'none';
          } catch {
            adapterState = 'error';
          }
        }

        const renderer = new WebGPURenderer({
          canvas: defaults.canvas,
          antialias: true,
          alpha: true,
          forceWebGL: props.forceWebGL,
        });

        await renderer.init();

        defaults.canvas.dataset.adapter = adapterState;
        defaults.canvas.dataset.backend =
          'isWebGPUBackend' in renderer.backend ? 'webgpu' : 'webgl2';

        return renderer;
      }}
    >
      <Sky />
      <Moon />
      <Clouds />
      <Rain />
      <CameraDrift enabled={props.animate} />
      {props.animate ? null : <FirstFrame />}
    </Canvas>
  );
}
