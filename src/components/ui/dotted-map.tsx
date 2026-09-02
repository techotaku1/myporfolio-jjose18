import type { ReactNode, SVGProps } from 'react';
import { createMap } from 'svg-dotted-map';

/** A geographic point highlighted on top of the dotted map. */
export type Marker = {
  lat: number;
  lng: number;
  size?: number;
  pulse?: boolean;
};

/** `addMarkers` strips lat/lng and returns grid coordinates plus any extra props. */
type MapMarker<M extends Marker> = Omit<M, 'lat' | 'lng'> & {
  x: number;
  y: number;
};

export type DottedMapProps<M extends Marker = Marker> = SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: M[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  stagger?: boolean;
  pulse?: boolean;
  renderMarkerOverlay?: (args: {
    marker: MapMarker<M>;
    index: number;
    x: number;
    y: number;
    r: number;
  }) => ReactNode;
};

/** Stable default for an omitted `markers` prop, so the reference never changes. */
const EMPTY_MARKERS: never[] = [];

/**
 * Measures the horizontal spacing between dots and indexes every row, so odd
 * rows can be offset by half a step to produce the staggered honeycomb look.
 *
 * @param points - Every dot position on the map, in any order.
 * @returns The smallest horizontal gap between dots and a row index per y value.
 */
function getStaggerGeometry(points: { x: number; y: number }[]) {
  const sorted = points.toSorted((a, b) => a.y - b.y || a.x - b.x);
  const yToRowIndex = new Map<number, number>();
  let step = 0;
  let prevY = Number.NaN;
  let prevXInRow = Number.NaN;

  for (const point of sorted) {
    if (point.y !== prevY) {
      prevY = point.y;
      prevXInRow = Number.NaN;
      if (!yToRowIndex.has(point.y)) {
        yToRowIndex.set(point.y, yToRowIndex.size);
      }
    }
    if (!Number.isNaN(prevXInRow)) {
      const delta = point.x - prevXInRow;
      if (delta > 0) {
        step = step === 0 ? delta : Math.min(step, delta);
      }
    }
    prevXInRow = point.x;
  }

  return { xStep: step || 1, yToRowIndex };
}

/**
 * Renders a world map as a grid of SVG dots, with optional markers placed by
 * latitude and longitude.
 *
 * Vendored from the Magic UI registry (`@magicui/dotted-map`). Upstream depends
 * on a `cn` helper and `useMemo`, neither of which this project ships — the
 * class names are joined inline and the React Compiler handles memoization.
 *
 * @param props - Map dimensions, dot styling, and the markers to highlight.
 * @returns The map as a responsive `<svg>` element.
 */
export function DottedMap<M extends Marker = Marker>(props: DottedMapProps<M>) {
  const {
    width = 150,
    height = 75,
    mapSamples = 5000,
    markers = EMPTY_MARKERS,
    dotColor = 'currentColor',
    markerColor = '#FF6900',
    dotRadius = 0.2,
    stagger = true,
    pulse = false,
    renderMarkerOverlay,
    className,
    style,
    ...svgProps
  } = props;
  const { points, addMarkers } = createMap({ width, height, mapSamples });
  const processedMarkers = addMarkers(markers);
  const { xStep, yToRowIndex } = getStaggerGeometry(points);

  const offsetFor = (y: number) => {
    const rowIndex = yToRowIndex.get(y) ?? 0;
    return stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
      {...svgProps}
    >
      {points.map((point, index) => (
        <circle
          cx={point.x + offsetFor(point.y)}
          cy={point.y}
          r={dotRadius}
          fill={dotColor}
          key={`${point.x}-${point.y}-${index}`}
        />
      ))}

      {processedMarkers.map((marker, index) => {
        const { y } = marker;
        const x = marker.x + offsetFor(y);
        const r = marker.size ?? dotRadius;
        const shouldPulse = pulse ? marker.pulse !== false : marker.pulse === true;
        const pulseTo = r * 2.8;

        return (
          <g key={`${marker.x}-${marker.y}-${index}`}>
            <circle cx={x} cy={y} r={r} fill={markerColor} />

            {shouldPulse ? (
              <g pointerEvents="none">
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={1}
                  strokeWidth={0.35}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={0.9}
                  strokeWidth={0.3}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0"
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ) : null}

            {renderMarkerOverlay?.({ marker: { ...marker, x, y }, index, x, y, r })}
          </g>
        );
      })}
    </svg>
  );
}
