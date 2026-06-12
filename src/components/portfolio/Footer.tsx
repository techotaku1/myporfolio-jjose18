import { PROFILE } from './constants';

export function Footer() {
  return (
    <footer className="foot divider">
      <div className="wrap foot-inner">
        <span>© 2026 {PROFILE.name.toUpperCase()} · DISPONIBLE PARA PROYECTOS</span>
        <div className="foot-links">
          <a href={PROFILE.github} target="_blank" rel="noopener">
            GITHUB
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener">
            LINKEDIN
          </a>
          <a href={`mailto:${PROFILE.email}`}>EMAIL</a>
        </div>
      </div>
    </footer>
  );
}
