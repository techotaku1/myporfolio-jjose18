'use client';

import { Bot, FolderGit2, Layers, Mail, Route } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NavItem } from '@/components/ui/limelight-nav';
import { LimelightNav } from '@/components/ui/limelight-nav';

const SECTIONS = [
  { id: 'proyectos', label: 'Proyectos', icon: <FolderGit2 /> },
  { id: 'ia', label: 'IA · Agentes', icon: <Bot /> },
  { id: 'stack', label: 'Stack', icon: <Layers /> },
  { id: 'experiencia', label: 'Trayectoria', icon: <Route /> },
  { id: 'contacto', label: 'Contacto', icon: <Mail /> },
] as const;

export function Nav() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll-spy: keep the limelight on whichever section crosses the viewport
  // center. Syncs with the DOM via IntersectionObserver — a genuine external
  // system.
  useEffect(() => {
    const sections = SECTIONS.map((s) => document.querySelector(`#${s.id}`)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const el of sections) {
      io.observe(el);
    }
    return () => {
      io.disconnect();
    };
  }, []);

  const items: NavItem[] = SECTIONS.map((s) => ({
    id: s.id,
    icon: s.icon,
    label: s.label,
    onClick: () => {
      document.querySelector(`#${s.id}`)?.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo">
          Jose
          <span>_</span>
          Gonzalez
        </a>

        <LimelightNav
          items={items}
          activeIndex={activeIndex}
          className="limelight-header"
          iconContainerClassName="px-3 sm:px-5"
        />

        <a className="btn btn-outline nav-cta" href="#contacto">
          hablemos.sh
        </a>
      </div>
    </header>
  );
}
