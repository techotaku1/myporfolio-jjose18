import type { Marker } from '@/components/ui/dotted-map';
import { DottedMap } from '@/components/ui/dotted-map';

const MAP_WIDTH = 200;
const MAP_HEIGHT = 100;

type FlagCode = 'es' | 'us' | 'co';

/** A callout pinned to one marker: flag badge plus a short English caption. */
type Callout = {
  flag: FlagCode;
  text: string;
  /** Badge width in viewBox units — sized by hand to fit the caption. */
  width: number;
  /** Badge offset from the marker, in viewBox units. */
  dx: number;
  dy: number;
};

type Spot = Marker & { id: string };

// Offsets place every badge over open water so no badge hides land or another
// badge, with the connector pointing back at its marker.
const CALLOUTS: Record<string, Callout> = {
  newYork: { flag: 'us', text: 'Open to work', width: 34, dx: 6, dy: -20 },
  madrid: { flag: 'es', text: 'Open to work', width: 34, dx: -46, dy: 6 },
  cali: { flag: 'co', text: 'I live here', width: 28, dx: -36, dy: -2 },
};

/** Cities carrying a callout — larger and pulsing so they read as the message. */
const ANCHORS: Spot[] = [
  { id: 'newYork', lat: 40.7128, lng: -74.006, size: 1.2, pulse: true },
  { id: 'madrid', lat: 40.4168, lng: -3.7038, size: 1.2, pulse: true },
  { id: 'cali', lat: 3.4516, lng: -76.532, size: 1.2, pulse: true },
];

/** Supporting cities across the US and Spain — plain dots, no callout. */
const SUPPORTING: Spot[] = [
  { id: 'sanFrancisco', lat: 37.7749, lng: -122.4194 },
  { id: 'losAngeles', lat: 34.0522, lng: -118.2437 },
  { id: 'seattle', lat: 47.6062, lng: -122.3321 },
  { id: 'denver', lat: 39.7392, lng: -104.9903 },
  { id: 'austin', lat: 30.2672, lng: -97.7431 },
  { id: 'chicago', lat: 41.8781, lng: -87.6298 },
  { id: 'miami', lat: 25.7617, lng: -80.1918 },
  { id: 'boston', lat: 42.3601, lng: -71.0589 },
  { id: 'barcelona', lat: 41.3874, lng: 2.1686 },
  { id: 'valencia', lat: 39.4699, lng: -0.3763 },
  { id: 'sevilla', lat: 37.3891, lng: -5.9845 },
  { id: 'bilbao', lat: 43.263, lng: -2.935 },
].map((city) => ({ ...city, size: 0.62 }));

const SPOTS: Spot[] = [...SUPPORTING, ...ANCHORS];

/** The thirteen stripes of the US flag, alternating red over a white field. */
const US_STRIPES = [0, 2, 4, 6, 8, 10, 12];

/** A 4x3 dot grid standing in for the fifty stars, which are unreadable this small. */
const US_STARS = Array.from({ length: 12 }, (_, index) => ({
  col: index % 4,
  row: Math.floor(index / 4),
}));

/**
 * Draws a flag as plain SVG rectangles, sized in the caller's coordinate space.
 *
 * Emoji flags are not an option here: Windows ships no regional-indicator
 * glyphs, so they degrade to bare letter pairs.
 *
 * @param props - The flag to draw and the box it should fill.
 * @returns The flag as an SVG group.
 */
function Flag(props: { code: FlagCode; x: number; y: number; w: number; h: number }) {
  if (props.code === 'co') {
    return (
      <g>
        <rect x={props.x} y={props.y} width={props.w} height={props.h / 2} fill="#FCD116" />
        <rect
          x={props.x}
          y={props.y + props.h / 2}
          width={props.w}
          height={props.h / 4}
          fill="#003893"
        />
        <rect
          x={props.x}
          y={props.y + (props.h * 3) / 4}
          width={props.w}
          height={props.h / 4}
          fill="#CE1126"
        />
      </g>
    );
  }

  if (props.code === 'es') {
    return (
      <g>
        <rect x={props.x} y={props.y} width={props.w} height={props.h} fill="#AA151B" />
        <rect
          x={props.x}
          y={props.y + props.h / 4}
          width={props.w}
          height={props.h / 2}
          fill="#F1BF00"
        />
      </g>
    );
  }

  const stripe = props.h / 13;
  const cantonW = props.w * 0.4;
  const cantonH = stripe * 7;

  return (
    <g>
      <rect x={props.x} y={props.y} width={props.w} height={props.h} fill="#FFFFFF" />
      {US_STRIPES.map((index) => (
        <rect
          x={props.x}
          y={props.y + index * stripe}
          width={props.w}
          height={stripe}
          fill="#B22234"
          key={index}
        />
      ))}
      <rect x={props.x} y={props.y} width={cantonW} height={cantonH} fill="#3C3B6E" />
      {US_STARS.map((star) => (
        <circle
          cx={props.x + ((star.col + 0.5) * cantonW) / 4}
          cy={props.y + ((star.row + 0.5) * cantonH) / 3}
          r={props.h * 0.055}
          fill="#FFFFFF"
          key={`${star.col}-${star.row}`}
        />
      ))}
    </g>
  );
}

/**
 * Draws the connector line and labelled badge for one anchored marker.
 *
 * @param props - The marker position and the callout to render beside it.
 * @returns The callout as an SVG group.
 */
function MarkerCallout(props: { x: number; y: number; callout: Callout }) {
  const badgeHeight = 8;
  const badgeX = props.x + props.callout.dx;
  const badgeY = props.y + props.callout.dy;
  // Connect to whichever edge of the badge faces the marker.
  const connectorX =
    props.callout.dx < -props.callout.width / 2 ? badgeX + props.callout.width : badgeX;

  return (
    <g className="availability-callout" pointerEvents="none">
      <line
        x1={props.x}
        y1={props.y}
        x2={connectorX}
        y2={badgeY + badgeHeight / 2}
        stroke="var(--primary)"
        strokeOpacity={0.55}
        strokeWidth={0.3}
      />
      <rect
        x={badgeX}
        y={badgeY}
        width={props.callout.width}
        height={badgeHeight}
        rx={4}
        fill="oklch(0.14 0.01 286 / 0.92)"
        stroke="var(--primary-line)"
        strokeWidth={0.3}
      />
      <Flag code={props.callout.flag} x={badgeX + 2.4} y={badgeY + 2.2} w={5.4} h={3.6} />
      <text
        x={badgeX + 9.8}
        y={badgeY + badgeHeight / 2 + 0.5}
        fontFamily="var(--font-mono)"
        fontSize={3.6}
        dominantBaseline="middle"
        fill="#ffffff"
      >
        {props.callout.text}
      </text>
    </g>
  );
}

/**
 * Legend rows. These carry the whole message on their own, which is why the
 * in-map callouts can be dropped on phones where their text would be ~6px.
 */
const LEGEND: { code: FlagCode; title: string; detail: string }[] = [
  {
    code: 'es',
    title: 'Spain',
    detail: 'Open to work — remote or relocation',
  },
  {
    code: 'us',
    title: 'United States',
    detail: 'Open to work — remote or relocation',
  },
  {
    code: 'co',
    title: 'Colombia',
    detail: 'I live here — Cali, Valle del Cauca',
  },
];

export function Availability() {
  return (
    <section className="sec divider" id="disponibilidad">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">GLOBAL_AVAILABILITY</span>
            <h2 className="display" style={{ marginTop: '0.75rem' }}>
              WHERE_I_WORK
            </h2>
            <div className="rule" style={{ marginTop: '1rem' }} />
          </div>
          <p className="muted sub">
            Based in Cali, Colombia. Open to remote roles and relocation in Spain and the United
            States.
          </p>
        </div>

        <div className="availability-map reveal">
          <DottedMap<Spot>
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            mapSamples={9000}
            markers={SPOTS}
            dotColor="rgba(255, 255, 255, 0.32)"
            dotRadius={0.28}
            markerColor="var(--primary)"
            // Hidden from assistive tech on purpose: the section intro and the
            // legend below already state every country the map marks, so an
            // accessible name here would only repeat them.
            aria-hidden="true"
            style={{ height: 'auto' }}
            renderMarkerOverlay={({ marker, x, y }) => {
              const callout = CALLOUTS[marker.id];
              return callout ? <MarkerCallout x={x} y={y} callout={callout} /> : null;
            }}
          />
        </div>

        <ul className="availability-legend reveal">
          {LEGEND.map((entry) => (
            <li key={entry.code}>
              <svg
                className="availability-flag"
                viewBox="0 0 6 4"
                width={28}
                height={19}
                aria-hidden="true"
              >
                <Flag code={entry.code} x={0} y={0} w={6} h={4} />
              </svg>
              <div>
                <strong>{entry.title}</strong>
                <span>{entry.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
