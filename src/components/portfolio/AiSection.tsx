import { useSyncExternalStore } from 'react';
import { AiToolTabs } from './AiToolTabs';
import { AI_TOOLS, METHODS } from './data';

/** Where the pinned tabs replace the grid: wide screens with motion allowed. */
const TABS_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

function subscribeTabsQuery(onChange: () => void) {
  const query = window.matchMedia(TABS_QUERY);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
}

function getTabsSnapshot() {
  return window.matchMedia(TABS_QUERY).matches;
}

// The server and the first client render show the grid, so the page never depends on JS.
function getTabsServerSnapshot() {
  return false;
}

export function AiSection() {
  const tabbed = useSyncExternalStore(subscribeTabsQuery, getTabsSnapshot, getTabsServerSnapshot);

  return (
    <section className="sec ai divider" id="ia">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">AI_NATIVE_DEVELOPMENT</span>
            <h2 className="display" style={{ marginTop: '0.75rem' }}>
              DESARROLLO AGÉNTICO
            </h2>
            <div className="rule" style={{ marginTop: '1rem' }} />
          </div>
          <p className="muted sub">
            Programo de forma nativa con IA: orquesto agentes, defino especificaciones y dejo que el
            sistema ejecute, verifique e itere.
          </p>
        </div>
        {/* Stays mounted while hidden: the page-level assembly registered its cards at mount. */}
        <div className="ai-grid" hidden={tabbed}>
          {AI_TOOLS.map((t) => (
            <div className="ai-tool reveal" key={t.n}>
              <span className="idx mono">{t.n}</span>
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
        {tabbed ? <AiToolTabs tools={AI_TOOLS} /> : null}
        <div className="method-row">
          {METHODS.map((m) => (
            <div className="method reveal" key={m.b}>
              <b>{m.b}</b>
              <span>{m.s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
