'use client';

import { useCallback, useSyncExternalStore } from 'react';

type HexagonBackgroundProps = {
  hexagonSize?: number;
  hexagonMargin?: number;
};

function subscribeToResize(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('resize', callback);
  };
}

function getServerGridSnapshot() {
  return 0;
}

export function HexagonBackground(props: HexagonBackgroundProps) {
  const hexagonSize = props.hexagonSize ?? 75;
  const hexagonMargin = props.hexagonMargin ?? 3;

  const hexagonWidth = hexagonSize;
  const hexagonHeight = hexagonSize * 1.1;
  const rowSpacing = hexagonSize * 0.8;
  const baseMarginTop = -36 - 0.275 * (hexagonSize - 100);
  const computedMarginTop = baseMarginTop + hexagonMargin;

  const getRows = useCallback(() => Math.ceil(window.innerHeight / rowSpacing) + 2, [rowSpacing]);
  const getColumns = useCallback(
    () => Math.ceil(window.innerWidth / hexagonWidth) + 2,
    [hexagonWidth],
  );

  const rows = useSyncExternalStore(subscribeToResize, getRows, getServerGridSnapshot);
  const columns = useSyncExternalStore(subscribeToResize, getColumns, getServerGridSnapshot);
  const grid = { rows, columns };

  return (
    <div className="hbg-wrap" aria-hidden="true">
      <style>{`:root { --hbg-margin: ${hexagonMargin}px; }`}</style>
      <div className="hbg-inner">
        {Array.from({ length: grid.rows }).map((_, row) => (
          <div
            key={row}
            className="hbg-row"
            style={{
              marginTop: computedMarginTop,
              marginLeft: (row % 2 === 0 ? -(hexagonSize / 2) : hexagonMargin / 2) - 10,
            }}
          >
            {Array.from({ length: grid.columns }).map((_col, col) => (
              <div
                key={col}
                className="hbg-hex"
                style={{
                  width: hexagonWidth,
                  height: hexagonHeight,
                  marginLeft: hexagonMargin,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
