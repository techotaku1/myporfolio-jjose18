import {
  color,
  float,
  instanceIndex,
  mix,
  mx_fractal_noise_float,
  positionLocal,
  positionWorld,
  smoothstep,
  time,
  uv,
  varying,
  vec3,
} from 'three/tsl';

// A plain float expression node, as every TSL operator chain returns. `float()`
// itself is not it: that builds a `VarNode`, a narrower type.
type FloatNode = ReturnType<typeof mx_fractal_noise_float>;

/** Half-width of the volume drops are scattered across, in world units. */
const RAIN_SPREAD_X = 150;
/** Depth of that volume. Kept short, and pushed back by `RAIN_CENTRE_Z`, so no
 * drop lands close enough to the camera to smear across the whole frame. */
const RAIN_SPREAD_Z = 60;
/** Centre of the rain volume along z, well in front of the camera. */
const RAIN_CENTRE_Z = -25;
/** Height a drop starts its cycle at. */
const RAIN_TOP = 46;
/** Distance a drop falls before its cycle wraps. */
const RAIN_FALL = 72;
/** Length of one streak. */
const RAIN_STREAK = 2.4;
/** Thickness of one streak. */
const RAIN_THICKNESS = 0.07;

/** Horizon colour; `SKY_LOW` matches it so the two read as one sky. */
const SKY_LOW = color('#3a4e85');
const SKY_HIGH = color('#0d1326');
const CLOUD_TINT = color('#5a72ad');
const RAIN_TINT = color('#cfe4ff');

/**
 * Hashes a node value into a repeatable pseudo-random node value.
 * TSL's own `hash` helper is a host-side number utility, so the shader needs
 * this sine-based form to vary drops without a per-instance attribute.
 * @param seed - Node whose value seeds the hash.
 * @returns A float node in `[0, 1)`.
 */
function hashNode(seed: FloatNode): FloatNode {
  return seed.mul(12.9898).sin().mul(43_758.5453).fract();
}

// Sampled in world space so each cloud plane sits on a different part of the
// noise field and no two look alike from one shared graph. The planes stay put
// and the field drifts through them, which avoids the pattern swimming across
// a moving mesh.
const cloudNoisePosition = vec3(
  positionWorld.x.mul(0.028).add(time.mul(0.01)),
  positionWorld.y.mul(0.05),
  positionWorld.z.mul(0.028),
);
const cloudDensity = mx_fractal_noise_float(cloudNoisePosition, 4, 2, 0.5, 1).mul(0.5).add(0.5);
const cloudFalloff = uv().sub(0.5).length().mul(2).oneMinus().saturate().pow(1.6);

/** Cloud colour, brightened where the noise field is dense. */
export const CLOUD_COLOR_NODE = CLOUD_TINT.mul(cloudDensity.mul(0.6).add(0.55));
/** Cloud opacity: soft-edged blobs that never reach full coverage. */
export const CLOUD_OPACITY_NODE = smoothstep(0.34, 0.72, cloudDensity.mul(cloudFalloff)).mul(0.8);

/** Vertical sky gradient for the backdrop plane, lightest at the horizon. */
export const SKY_COLOR_NODE = mix(SKY_LOW, SKY_HIGH, uv().y.pow(0.75));

// Every drop's position is a pure function of its instance index and the clock,
// evaluated in the vertex stage: no CPU loop per frame, and no compute shader
// either, which is what keeps the rain alive on the WebGL2 fallback. The
// instance matrices stay identity; `positionNode` does all the placing.
const dropIndex = float(instanceIndex);
const seedX = hashNode(dropIndex.mul(1.37));
const seedZ = hashNode(dropIndex.mul(2.71).add(11.3));
const seedPhase = hashNode(dropIndex.mul(4.19).add(37.7));

const fallSpeed = seedPhase.mul(0.45).add(0.8);
// `fract` is what wraps a drop back to the top; each drop keeps its own offset
// so they do not fall in lockstep.
const fallCycle = time.mul(fallSpeed).add(seedPhase.mul(19)).fract();

const dropOffset = vec3(
  seedX.sub(0.5).mul(RAIN_SPREAD_X),
  float(RAIN_TOP).sub(fallCycle.mul(RAIN_FALL)),
  seedZ.sub(0.5).mul(RAIN_SPREAD_Z).add(RAIN_CENTRE_Z),
);

/** Streak geometry, stretched then moved to this drop's place in the fall. */
export const RAIN_POSITION_NODE = positionLocal
  .mul(vec3(RAIN_THICKNESS, RAIN_STREAK, RAIN_THICKNESS))
  .add(dropOffset);

// Faded in at the top and out at the bottom so drops never pop into view.
// Carried to the fragment stage explicitly: `instanceIndex` is a vertex-stage
// builtin and has no meaning once the fragment shader runs.
const dropFade = smoothstep(0, 0.05, fallCycle).mul(smoothstep(0.88, 1, fallCycle).oneMinus());
const dropAlpha = varying(dropFade.mul(seedPhase.mul(0.45).add(0.4)));

/** Streak colour: a pale, almost white blue. */
export const RAIN_COLOR_NODE = RAIN_TINT;
/** Streak opacity, varied per drop so the fall reads as having depth. */
export const RAIN_OPACITY_NODE = dropAlpha.mul(0.55);
