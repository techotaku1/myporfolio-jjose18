import React from 'react';

type OrbitingCirclesProps = {
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles(props: OrbitingCirclesProps) {
  const reverse = props.reverse ?? false;
  const duration = props.duration ?? 20;
  const radius = props.radius ?? 100;
  const path = props.path ?? true;
  const iconSize = props.iconSize ?? 36;
  const speed = props.speed ?? 1;

  const calculatedDuration = duration / speed;
  const count = React.Children.count(props.children);

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <circle cx="50%" cy="50%" r={radius} fill="none" className="orbit-ring" />
        </svg>
      )}
      {React.Children.map(props.children, (child, index) => {
        const angle = (360 / count) * index;
        return (
          <div
            className={`orbit-item${reverse ? ' orbit-reverse' : ''}`}
            style={
              {
                '--duration': calculatedDuration,
                '--radius': radius,
                '--angle': angle,
                width: iconSize,
                height: iconSize,
              } as React.CSSProperties
            }
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
