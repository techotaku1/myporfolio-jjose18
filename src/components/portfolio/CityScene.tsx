'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { InstancedMesh } from 'three';
import { Object3D } from 'three';
import { MeshBasicNodeMaterial, WebGPURenderer } from 'three/webgpu';
import { createSkyline } from './cityGeometry';
import {
  BUILDING_COLOR_NODE,
  CLOUD_COLOR_NODE,
  CLOUD_OPACITY_NODE,
  SKY_COLOR_NODE,
} from './cityNodes';

type CloudLayer = {
  position: [number, number, number];
  scale: [number, number, number];
};

/** Registers the node material as JSX so the module-scope graphs ride in as props. */
const NodeMaterial = extend(MeshBasicNodeMaterial);

const BUILDINGS = createSkyline({
  seed: 20_260_515,
  columns: 17,
  rows: 11,
  spacingX: 7.5,
  spacingZ: 9,
  minHeight: 3.5,
  maxHeight: 34,
  gapChance: 0.18,
});

/** Cloud banks, placed by hand so they frame the skyline instead of covering it. */
const CLOUD_LAYERS: CloudLayer[] = [
  { position: [-34, 26, -62], scale: [96, 34, 1] },
  { position: [28, 31, -74], scale: [120, 40, 1] },
  { position: [6, 20, -44], scale: [72, 24, 1] },
  { position: [-52, 35, -88], scale: [110, 38, 1] },
  { position: [48, 22, -36], scale: [66, 22, 1] },
  { position: [0, 38, -104], scale: [160, 46, 1] },
];

/**
 * Drifts the camera so the skyline keeps a slow parallax with no input of its own.
 * @param props - `enabled` false parks the camera on its opening framing.
 * @returns Nothing; the component only drives the shared camera.
 */
function CameraDrift(props: { enabled: boolean }) {
  useFrame((state) => {
    const elapsed = props.enabled ? state.clock.elapsedTime : 0;

    state.camera.position.x = Math.sin(elapsed * 0.045) * 2.6;
    state.camera.position.y = 9 + Math.sin(elapsed * 0.031) * 0.7;
    state.camera.lookAt(0, 7, -40);
  });

  return null;
}

/**
 * Draws the whole skyline as a single instanced box mesh.
 * @returns The instanced towers.
 */
function Buildings() {
  const mesh = useRef<InstancedMesh>(null);

  // Writing instance matrices is a one-way sync into a Three.js buffer, which
  // is the external-system case a layout effect exists for.
  useLayoutEffect(() => {
    const instanced = mesh.current;

    if (!instanced) {
      return;
    }

    const transform = new Object3D();

    for (const [index, building] of BUILDINGS.entries()) {
      transform.position.set(building.x, building.height / 2, building.z);
      transform.scale.set(building.width, building.height, building.depth);
      transform.updateMatrix();
      instanced.setMatrixAt(index, transform.matrix);
    }

    instanced.instanceMatrix.needsUpdate = true;
    instanced.computeBoundingBox();
    instanced.computeBoundingSphere();
  }, []);

  return (
    <instancedMesh args={[undefined, undefined, BUILDINGS.length]} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <NodeMaterial colorNode={BUILDING_COLOR_NODE} />
    </instancedMesh>
  );
}

/**
 * Hangs the drifting cloud banks above and behind the skyline.
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
 * Fills the frustum behind the city with the night-sky gradient.
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
 * Renders the WebGPU city: night sky, drifting clouds and an instanced skyline.
 * Lives behind a `navigator.gpu` check in `CityBackground`, so this module —
 * and the Three.js bundle it pulls in — never reaches a browser without WebGPU.
 * @param props - `animate` false renders a single still frame instead of a loop.
 * @returns The canvas holding the scene.
 */
export function CityScene(props: { animate: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 9, 26], fov: 46, near: 0.5, far: 320 }}
      dpr={[1, 1.5]}
      frameloop={props.animate ? 'always' : 'demand'}
      gl={async (defaults) => {
        if (!(defaults.canvas instanceof HTMLCanvasElement)) {
          throw new Error('The city background needs a browser canvas');
        }

        const renderer = new WebGPURenderer({
          canvas: defaults.canvas,
          antialias: true,
          alpha: true,
        });

        await renderer.init();

        return renderer;
      }}
    >
      <Sky />
      <Clouds />
      <Buildings />
      <CameraDrift enabled={props.animate} />
      {props.animate ? null : <FirstFrame />}
    </Canvas>
  );
}
