import {
  cameraPosition,
  color,
  mix,
  mx_fractal_noise_float,
  normalWorld,
  positionWorld,
  smoothstep,
  step,
  time,
  uv,
  vec2,
  vec3,
} from 'three/tsl';

// A plain float expression node, as every TSL operator chain returns. `float()`
// itself is not it: that builds a `VarNode`, a narrower type.
type FloatNode = ReturnType<typeof mx_fractal_noise_float>;

/** World units between two window rows, shared by every tower whatever its instance scale. */
const FLOOR_HEIGHT = 1.45;
/** World units between two window columns. */
const WINDOW_PITCH = 1.15;
/** Distance at which the haze starts eating the facades. */
const HAZE_NEAR = 38;
/** Distance at which a facade is fully dissolved into the sky. */
const HAZE_FAR = 150;

const FACADE = color('#090b13');
const WINDOW_WARM = color('#ffc46b');
const WINDOW_COOL = color('#6fd8ff');
/** Horizon colour; `SKY_LOW` matches it so fogged towers dissolve seamlessly. */
const HAZE = color('#121a30');
const SKY_LOW = color('#121a30');
const SKY_HIGH = color('#05070f');
const CLOUD_TINT = color('#2a3a63');

/** Direction the facades are lit from, so neighbouring box faces read apart. */
const LIGHT_DIRECTION = vec3(0.45, 0.35, 0.82);

/**
 * Hashes a node value into a repeatable pseudo-random node value.
 * TSL's own `hash` helper is a host-side number utility, so the shader needs
 * this sine-based form to vary windows without a per-instance attribute.
 * @param seed - Node whose value seeds the hash.
 * @returns A float node in `[0, 1)`.
 */
function hashNode(seed: FloatNode): FloatNode {
  return seed.mul(12.9898).sin().mul(43_758.5453).fract();
}

// Window grid, measured in world units rather than UVs: a box's UVs run 0..1
// per face regardless of instance scale, which would give a 40-storey tower and
// a 3-storey block the same number of floors.
const windowColumn = positionWorld.x.add(positionWorld.z).div(WINDOW_PITCH);
const windowRow = positionWorld.y.div(FLOOR_HEIGHT);
const windowCell = vec2(windowColumn, windowRow);
const cellId = windowCell.floor();
const inCell = windowCell.fract();

const edgeX = inCell.x.sub(0.5).abs();
const edgeY = inCell.y.sub(0.5).abs();
const windowMask = smoothstep(0.2, 0.3, edgeX)
  .oneMinus()
  .mul(smoothstep(0.24, 0.34, edgeY).oneMinus());

const windowSeed = hashNode(cellId.x.mul(7.13).add(cellId.y.mul(131.7)));
const windowTint = mix(WINDOW_WARM, WINDOW_COOL, step(0.78, windowSeed));
const windowLit = step(0.46, windowSeed);
const windowBreathe = windowSeed.mul(31.4).add(time.mul(0.35)).sin().mul(0.1).add(0.9);
const windowEmission = windowTint.mul(windowMask).mul(windowLit).mul(windowBreathe).mul(1.35);

const faceShade = normalWorld.dot(LIGHT_DIRECTION).mul(0.5).add(0.5);
const facade = FACADE.mul(faceShade.mul(0.7).add(0.35));
const cameraDistance = positionWorld.sub(cameraPosition).length();
const facadeHaze = smoothstep(HAZE_NEAR, HAZE_FAR, cameraDistance);

/** Facade colour for the instanced towers: lit windows, shaded faces, distance haze. */
export const BUILDING_COLOR_NODE = mix(facade.add(windowEmission), HAZE, facadeHaze);

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
export const CLOUD_OPACITY_NODE = smoothstep(0.46, 0.8, cloudDensity.mul(cloudFalloff)).mul(0.55);

/** Vertical sky gradient for the backdrop plane, lightest at the horizon. */
export const SKY_COLOR_NODE = mix(SKY_LOW, SKY_HIGH, uv().y.pow(0.75));
