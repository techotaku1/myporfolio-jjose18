import { AI_TOOLS, METHODS } from './data';

export function AiSection() {
  return (
    <section className="sec ai divider" id="ia">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">// AI_NATIVE_DEVELOPMENT</span>
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
        <div className="ai-grid">
          {AI_TOOLS.map((t) => (
            <div className="ai-tool reveal" key={t.n}>
              <span className="idx mono">{t.n}</span>
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
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
