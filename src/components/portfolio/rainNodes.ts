import {
  cameraPosition,
  color,
  float,
  instanceIndex,
  mix,
  mx_fractal_noise_float,
  normalWorld,
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
const MOON_LIT = color('#e8edff');
const MOON_SHADE = color('#2b3356');
const MOON_GLOW = color('#8fa6e8');

/** Direction the sunlight reaches the moon from, which sets its phase. */
const MOON_LIGHT = vec3(0.62, 0.3, 0.72).normalize();

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

/** Distance at which aerial perspective starts washing a cloud bank out. */
const CLOUD_NEAR = 70;
/** Distance at which a bank is as washed out as it gets. */
const CLOUD_FAR = 165;

/**
 * Builds one cloud bank's shading graph.
 * Call this once per bank at module scope, never per render: each bank needs
 * its own graph because the seed is baked in, and a node graph has to stay
 * referentially stable.
 * @param seed - Offsets this bank's slice of the noise field so no two banks share a shape.
 * @returns The bank's colour and opacity nodes.
 */
export function createCloudNodes(seed: number) {
  // Sampled in the plane's own UVs rather than world space, so the shape is
  // pinned to the mesh and translates rigidly as the bank drifts. A world-space
  // field would make the pattern swim through a moving plane instead.
  const noisePosition = vec3(
    uv().x.mul(3.4).add(seed),
    uv()
      .y.mul(1.7)
      .add(seed * 0.63),
    // Slow churn, so the vapour keeps evolving while the bank travels.
    time.mul(0.012).add(seed * 1.37),
  );
  const density = mx_fractal_noise_float(noisePosition, 4, 2, 0.5, 1).mul(0.5).add(0.5);
  const falloff = uv().sub(0.5).length().mul(2).oneMinus().saturate().pow(1.6);

  // Aerial perspective. This is what actually reads as depth: a far bank loses
  // contrast toward the horizon colour and thins out, so the eye places it
  // behind a near one even though both are flat planes.
  const cameraDistance = positionWorld.sub(cameraPosition).length();
  const haze = smoothstep(CLOUD_NEAR, CLOUD_FAR, cameraDistance);
  const tint = mix(CLOUD_TINT, SKY_LOW, haze.mul(0.75));

  return {
    color: tint.mul(density.mul(0.6).add(0.55)),
    opacity: smoothstep(0.26, 0.66, density.mul(falloff)).mul(haze.oneMinus().mul(0.45).add(0.5)),
  };
}

// The moon is shaded by hand rather than lit: a basic node material costs no
// light setup, and the terminator is the only shading a sphere this size needs.
const moonFacing = normalWorld.dot(MOON_LIGHT);
// Softened so the edge reads as a curved surface instead of a hard cut.
const moonDay = smoothstep(-0.18, 0.35, moonFacing);
// Craters and maria sampled in object space, so the pattern sticks to the
// surface rather than sliding across it as the sphere sits in the scene.
const moonSurface = mx_fractal_noise_float(positionLocal.mul(2.6), 4, 2, 0.5, 1).mul(0.5).add(0.5);
const moonMaria = smoothstep(0.44, 0.64, moonSurface).mul(0.26);
// Earthshine keeps the unlit limb from falling to flat black against the sky.
const moonNight = MOON_SHADE.mul(moonDay.oneMinus().mul(0.5).add(0.12));

/** Moon surface: lit face with dark maria, fading into a faint earthlit limb. */
export const MOON_COLOR_NODE = mix(moonNight, MOON_LIT.mul(moonMaria.oneMinus()), moonDay);

const moonHaloFalloff = uv().sub(0.5).length().mul(2).oneMinus().saturate();

/** Halo colour for the glow plane sitting behind the moon. */
export const MOON_HALO_COLOR_NODE = MOON_GLOW;
/** Halo opacity: a tight bloom that falls off well before the plane's edge. */
export const MOON_HALO_OPACITY_NODE = moonHaloFalloff.pow(3.2).mul(0.6);

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
export const RAIN_OPACITY_NODE = dropAlpha.mul(0.42);
