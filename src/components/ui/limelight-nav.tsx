'use client';

import { useLayoutEffect, useRef, useState } from 'react';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);
const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export type NavItem = {
  id: string | number;
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  {
    id: 'default-notifications',
    icon: <DefaultBellIcon />,
    label: 'Notifications',
  },
];

type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  /**
   * Controlled active index. When provided, the bar reflects this value instead
   * of its internal click state — useful for scroll-spy navigation.
   */
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

// An adaptive-width navigation bar with a "limelight" effect that highlights
// the active item.
export const LimelightNav = (props: LimelightNavProps) => {
  const {
    items = defaultNavItems,
    defaultActiveIndex = 0,
    activeIndex: controlledIndex,
    onTabChange,
    className,
    limelightClassName,
    iconContainerClassName,
    iconClassName,
  } = props;

  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = controlledIndex ?? internalIndex;

  useLayoutEffect(() => {
    if (items.length === 0) {
      return;
    }

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const newLeft =
        activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;

      if (!isReady) {
        setTimeout(() => {
          setIsReady(true);
        }, 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setInternalIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      className={`relative inline-flex h-16 items-center rounded-lg border bg-[var(--card)] px-2 text-[var(--fg)] ${className ?? ''}`}
    >
      {items.map(({ id, icon, label, onClick }, index) => (
        <button
          key={id}
          ref={(el) => {
            navItemRefs.current[index] = el;
          }}
          type="button"
          className={`relative z-20 flex h-full cursor-pointer items-center justify-center bg-transparent p-5 ${iconContainerClassName ?? ''}`}
          onClick={() => {
            handleItemClick(index, onClick);
          }}
          aria-label={label}
        >
          <span
            className={`flex transition-opacity duration-100 ease-in-out [&>svg]:h-6 [&>svg]:w-6 ${
              activeIndex === index ? 'opacity-100' : 'opacity-40'
            } ${iconClassName ?? ''}`}
          >
            {icon}
          </span>
        </button>
      ))}

      <div
        ref={limelightRef}
        className={`absolute top-0 z-10 h-[5px] w-11 rounded-full bg-[var(--primary)] shadow-[0_50px_15px_var(--primary)] ${
          isReady ? 'transition-[left] duration-400 ease-in-out' : ''
        } ${limelightClassName ?? ''}`}
        style={{ left: '-999px' }}
      >
        <div className="pointer-events-none absolute top-[5px] left-[-30%] h-14 w-[160%] bg-gradient-to-b from-[var(--primary-line)] to-transparent [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]" />
      </div>
    </nav>
  );
};
