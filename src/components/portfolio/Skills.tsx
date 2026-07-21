import { SKILLS, STROKE_ICONS, TECH_BADGES } from './data';
import { Icon } from './Icon';
import { OrbitingCircles } from './OrbitingCircles';

const TILES: [string, string][] = [
  ['CÓDIGO_LIMPIO', STROKE_ICONS.code],
  ['BASES_ESCALABLES', STROKE_ICONS.db],
  ['RENDIMIENTO', STROKE_ICONS.cpu],
  ['DEVOPS', STROKE_ICONS.term],
];

export function Skills() {
  return (
    <section className="sec divider" id="stack">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">HERRAMIENTAS_DIARIAS</span>
            <h2 className="display" style={{ marginTop: '0.75rem' }}>
              TECH_STACK
            </h2>
            <div className="rule" style={{ marginTop: '1rem' }} />
          </div>
          <p className="muted sub">
            Mis herramientas de cabecera para construir productos digitales. Siempre aprendiendo,
            siempre evolucionando.
          </p>
        </div>
        <div className="skills-grid">
          <div className="reveal">
            <div className="skill-tiles">
              {TILES.map(([label, d]) => (
                <div className="skill-tile" key={label}>
                  <Icon d={d} stroke size={30} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skill-cols">
            {SKILLS.map((g) => (
              <div className="reveal" key={g.cat}>
                <h3>{g.cat}</h3>
                <ul>
                  {g.items.map((s) => (
                    <li key={s}>
                      <span>{s}</span>
                      <i />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <h3 className="tech-badges-title reveal">Skills</h3>
        <div className="tech-badges reveal">
          {TECH_BADGES.map((b) => (
            <span className="tech-badge" key={b.label}>
              <img
                src={`/skills-icon/${b.icon}`}
                alt={b.label}
                width={18}
                height={18}
                className={b.invert ? 'icon-invert' : undefined}
              />
              {b.label}
            </span>
          ))}
        </div>
        <div className="orbit-container reveal">
          <div className="orbit-center">
            <span className="orbit-center-label">STACK</span>
            <span className="orbit-center-title">IA_AGENTIC</span>
          </div>
          <OrbitingCircles radius={130} duration={18} iconSize={48}>
            <img src="/skills-icon/claude.svg" alt="Claude" width={28} height={28} />
            <img
              src="/skills-icon/openai-chatgpt.svg"
              alt="ChatGPT"
              width={28}
              height={28}
              className="icon-invert"
            />
            <img src="/skills-icon/file-type-gemini.svg" alt="Gemini" width={28} height={28} />
          </OrbitingCircles>
          <OrbitingCircles radius={195} duration={30} iconSize={48} reverse>
            <img
              src="/skills-icon/openai-chatgpt.svg"
              alt="ChatGPT"
              width={28}
              height={28}
              className="icon-invert"
            />
            <img src="/skills-icon/file-type-gemini.svg" alt="Gemini" width={28} height={28} />
            <img src="/skills-icon/claude.svg" alt="Claude" width={28} height={28} />
          </OrbitingCircles>
        </div>
      </div>
    </section>
  );
}
