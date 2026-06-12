import { EDU, EXPERIENCE } from './data';

export function Experience() {
  return (
    <section className="sec divider" id="experiencia">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <h2 className="display">TRAYECTORIA</h2>
            <div className="rule" style={{ marginTop: '1rem' }} />
          </div>
          <p className="muted sub">Experiencia profesional y formación académica.</p>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((e) => (
            <div className="tl-item reveal" key={`${e.when}-${e.role}`}>
              <div className="tl-when">{e.when}</div>
              <div>
                <div className="tl-role">{e.role}</div>
                <div className="tl-org">{e.org}</div>
                <div className="tl-body">
                  <ul>
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="edu-grid">
          {EDU.map((e) => (
            <div className="edu reveal" key={e.t}>
              <b>{e.t}</b>
              <div className="org mono">{e.org}</div>
              <div className="yr">{e.yr}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
