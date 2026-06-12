import { PROJECTS, STROKE_ICONS } from './data';
import { Icon } from './Icon';
import { ProjectArt } from './ProjectArt';

export function Projects() {
  return (
    <section className="sec divider" id="proyectos">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <h2 className="display">PROYECTOS DESTACADOS</h2>
            <div className="rule" style={{ marginTop: '1rem' }} />
          </div>
          <p className="muted sub">
            Plataformas en producción, automatización con IA y trabajo freelance de desarrollo web.
          </p>
        </div>
        <div className="grid-cards">
          {PROJECTS.map((p, i) => (
            <article
              className="card reveal"
              key={p.title}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="card-img">
                <ProjectArt type={p.art} />
              </div>
              <div className="card-body">
                <h3>{p.title}</h3>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="muted" style={{ fontSize: '0.92rem' }}>
                  {p.desc}
                </p>
              </div>
              <div className="card-foot">
                <span className="muted mono" style={{ fontSize: '0.72rem' }}>
                  {p.role}
                </span>
                <a href="#contacto">
                  VER MÁS <Icon d={STROKE_ICONS.arrow} stroke size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
