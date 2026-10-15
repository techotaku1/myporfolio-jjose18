import type { KeyboardEvent } from 'react';
import { useId, useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '@/libs/Gsap';
import type { AiTool } from './data';
import { indexToProgress, progressToIndex, tabIndexForKey } from './motion';

/** Viewport heights of scroll that each tool stays active while the stage is pinned. */
const SCROLL_PER_TAB = 0.45;

type TabState = 'done' | 'active' | 'next';

/**
 * Describes where a tab sits relative to the active one, for its progress line.
 * @param index - Tab being rendered.
 * @param active - Index of the active tab.
 * @returns `done` for tabs already scrolled past, `active` for the current one, `next` otherwise.
 */
function tabState(index: number, active: number): TabState {
  if (index < active) {
    return 'done';
  }

  return index === active ? 'active' : 'next';
}

/**
 * Pins the AI tools on desktop and steps through them as the page scrolls: a tab list on the
 * left and the active tool on the right. Clicking a tab, or moving through the list with the
 * arrow keys, scrolls to that tool's segment, so scroll position stays the single source of
 * the active tab.
 * @param props - Component props.
 * @param props.tools - Tools to show, one tab each.
 * @returns The pinned stage, or `null` when there are no tools.
 */
export function AiToolTabs(props: { tools: AiTool[] }) {
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const id = useId();
  const count = props.tools.length;
  const tool = props.tools[active];
  const panelId = `${id}-panel`;

  useGSAP(
    () => {
      const stage = root.current?.querySelector<HTMLElement>('.ai-stage');

      if (stage) {
        // The stage is a child of this component's root, so the pin spacer GSAP inserts
        // stays inside markup React owns.
        pin.current = ScrollTrigger.create({
          trigger: stage,
          pin: true,
          start: 'center center',
          end: () => `+=${Math.round(window.innerHeight * SCROLL_PER_TAB * count)}`,
          invalidateOnRefresh: true,
          // Created after the page-level triggers: refresh it first so the triggers below it
          // measure the page with its pin spacing in place.
          refreshPriority: 1,
          onUpdate: (self) => {
            const index = progressToIndex(self.progress, count);
            setActive(index);
            // How far the active segment has been scrolled, for its progress line.
            stage.style.setProperty('--seg', String(Math.min(1, self.progress * count - index)));
          },
        });

        ScrollTrigger.refresh();
      }

      return () => {
        pin.current = null;
        // The static grid takes the stage's place, so the triggers below move again.
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      };
    },
    { scope: root },
  );

  function select(index: number) {
    const trigger = pin.current;

    if (!trigger) {
      setActive(index);
      return;
    }

    const progress = indexToProgress(index, count);
    window.scrollTo({
      top: trigger.start + progress * (trigger.end - trigger.start),
      behavior: 'smooth',
    });
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = tabIndexForKey(event.key, index, count);

    if (next === null) {
      return;
    }

    event.preventDefault();
    const tabs =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    // The smooth scroll in `select` brings the stage into place; a focus scroll would fight it.
    tabs?.[next]?.focus({ preventScroll: true });
    select(next);
  }

  if (!tool) {
    return null;
  }

  return (
    <div className="ai-pin" ref={root}>
      <div className="ai-stage">
        <div
          className="ai-tabs"
          role="tablist"
          aria-label="Herramientas"
          aria-orientation="vertical"
        >
          {props.tools.map((t, i) => (
            <button
              type="button"
              role="tab"
              className="ai-tab"
              id={`${id}-tab-${i}`}
              key={t.n}
              aria-selected={i === active}
              aria-controls={panelId}
              tabIndex={i === active ? 0 : -1}
              data-state={tabState(i, active)}
              onClick={() => {
                select(i);
              }}
              onKeyDown={(event) => {
                onTabKeyDown(event, i);
              }}
            >
              <span className="ai-tab-idx">{t.n}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
        <div
          className="ai-panel"
          role="tabpanel"
          id={panelId}
          aria-labelledby={`${id}-tab-${active}`}
          tabIndex={0}
        >
          {/* Keyed so each tool replays the panel's entrance. */}
          <div className="ai-panel-body" key={tool.n}>
            <span className="ai-panel-idx">
              {tool.n} / {String(count).padStart(2, '0')}
            </span>
            <h3>{tool.name}</h3>
            <p>{tool.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
