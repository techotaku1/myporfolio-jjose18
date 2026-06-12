'use client';

import { useState } from 'react';
import { PROFILE } from './constants';
import { STROKE_ICONS } from './data';
import { Icon } from './Icon';

const LINKS: [string, string][] = [
  ['#proyectos', 'Proyectos'],
  ['#ia', 'IA · Agentes'],
  ['#stack', 'Stack'],
  ['#experiencia', 'Trayectoria'],
  ['#contacto', 'Contacto'],
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo">
          Jose
          <span>_</span>
          Gonzalez
        </a>
        <nav className="nav-links">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="btn btn-outline nav-cta" href={`mailto:${PROFILE.email}`}>
          hablemos.sh
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menú"
          onClick={() => {
            setOpen((o) => !o);
          }}
        >
          <Icon d={open ? STROKE_ICONS.close : STROKE_ICONS.menu} stroke />
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          {LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => {
                setOpen(false);
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
