type IconProps = {
  d: string;
  size?: number;
  stroke?: boolean;
};

// Single-path SVG icon. Renders filled by default, or outlined when `stroke`.
export function Icon(props: IconProps) {
  const size = props.size ?? 20;
  const isStroke = props.stroke ?? false;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isStroke ? 'none' : 'currentColor'}
      stroke={isStroke ? 'currentColor' : 'none'}
      strokeWidth={isStroke ? 1.6 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={props.d} />
    </svg>
  );
}
