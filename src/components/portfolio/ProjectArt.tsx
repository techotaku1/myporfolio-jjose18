import type { ProjectArtType } from './data';

// Abstract, elegant project artwork that adapts to the accent color via CSS vars.
function ArtFrame(props: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect x="0" y="0" width="320" height="200" fill="var(--secondary)" opacity="0.35" />
      <g stroke="var(--border)" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 32 + 4} x2="320" y2={i * 32 + 4} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 32 + 4} y1="0" x2={i * 32 + 4} y2="200" />
        ))}
      </g>
      {props.children}
    </svg>
  );
}

function SocialArt() {
  const nodes: [number, number][] = [
    [44, 52],
    [118, 32],
    [198, 58],
    [272, 40],
    [78, 118],
    [158, 104],
    [244, 128],
    [104, 168],
    [206, 172],
    [288, 150],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [1, 5],
    [2, 6],
    [4, 5],
    [5, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [7, 8],
    [8, 9],
    [3, 6],
  ];
  const accent = new Set([1, 5, 8]);

  return (
    <ArtFrame>
      <g stroke="var(--primary)" strokeWidth="1" opacity="0.55">
        {edges.map(([a, b]) => {
          const from = nodes[a];
          const to = nodes[b];
          if (!from || !to) {
            return null;
          }
          return <line key={`${a}-${b}`} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />;
        })}
      </g>
      {nodes.map(([x, y], i) =>
        accent.has(i) ? (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="9" fill="var(--primary)" opacity="0.18" />
            <circle cx={x} cy={y} r="5" fill="var(--primary)" />
          </g>
        ) : (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="5"
            fill="var(--card)"
            stroke="var(--muted)"
            strokeWidth="1.4"
          />
        ),
      )}
    </ArtFrame>
  );
}

function FlowNode(props: { x: number; y: number; accent?: boolean }) {
  const { x, y } = props;
  const accent = props.accent ?? false;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="74"
        height="38"
        rx="4"
        fill="var(--card)"
        stroke={accent ? 'var(--primary)' : 'var(--border)'}
        strokeWidth="1.4"
      />
      <circle cx={x + 12} cy={y + 19} r="3.5" fill={accent ? 'var(--primary)' : 'var(--muted)'} />
      <rect
        x={x + 22}
        y={y + 13}
        width="40"
        height="3.5"
        rx="1.75"
        fill="var(--muted)"
        opacity="0.7"
      />
      <rect
        x={x + 22}
        y={y + 22}
        width="26"
        height="3.5"
        rx="1.75"
        fill="var(--muted)"
        opacity="0.45"
      />
    </g>
  );
}

function FlowArt() {
  const dots: [number, number][] = [
    [94, 49],
    [142, 92],
    [216, 92],
    [264, 49],
    [264, 135],
  ];

  return (
    <ArtFrame>
      <g fill="none" stroke="var(--primary)" strokeWidth="1.6" opacity="0.8">
        <path d="M94 49 C118 49, 118 92, 142 92" />
        <path d="M216 92 C240 92, 240 49, 264 49" />
        <path d="M216 92 C240 92, 240 135, 264 135" />
      </g>
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="var(--primary)" />
      ))}
      <FlowNode x={20} y={30} />
      <FlowNode x={142} y={73} accent />
      <FlowNode x={264} y={30} />
      <FlowNode x={264} y={116} />
    </ArtFrame>
  );
}

function WindowArt() {
  const sidebar = [70, 84, 98, 112];
  const codeLines: [number, number, number][] = [
    [92, 70, 46],
    [110, 80, 0],
    [110, 92, 80],
    [128, 102, 0],
    [128, 114, 60],
    [92, 124, 0],
    [110, 134, 90],
    [128, 144, 0],
    [92, 154, 40],
  ];

  return (
    <ArtFrame>
      <rect
        x="36"
        y="34"
        width="248"
        height="132"
        rx="6"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.4"
      />
      <rect x="36" y="34" width="248" height="22" rx="6" fill="var(--secondary)" opacity="0.6" />
      <rect x="36" y="50" width="248" height="6" fill="var(--secondary)" opacity="0.6" />
      <circle cx="50" cy="45" r="3" fill="var(--muted)" />
      <circle cx="62" cy="45" r="3" fill="var(--muted)" />
      <circle cx="74" cy="45" r="3" fill="var(--primary)" />
      <line x1="78" y1="56" x2="78" y2="166" stroke="var(--border)" strokeWidth="1.2" />
      {sidebar.map((y) => (
        <rect
          key={`sb${y}`}
          x="48"
          y={y}
          width="20"
          height="4"
          rx="2"
          fill="var(--muted)"
          opacity="0.5"
        />
      ))}
      {codeLines.map(([x, y, acc], i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={acc || 150 - ((i * 7) % 80)}
          height="5"
          rx="2.5"
          fill={acc ? 'var(--primary)' : 'var(--muted)'}
          opacity={acc ? 0.9 : 0.4}
        />
      ))}
    </ArtFrame>
  );
}

export function ProjectArt(props: { type: ProjectArtType }) {
  if (props.type === 'social') {
    return <SocialArt />;
  }
  if (props.type === 'flow') {
    return <FlowArt />;
  }
  return <WindowArt />;
}
