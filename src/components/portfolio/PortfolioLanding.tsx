'use client';

import { useRef } from 'react';
import { AiSection } from './AiSection';
import { Availability } from './Availability';
import { CityBackground } from './CityBackground';
import { Contact } from './Contact';
import { Experience } from './Experience';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { HexagonBackground } from './HexagonBackground';
import { Nav } from './Nav';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { usePortfolioMotion } from './usePortfolioMotion';
import { WhatsAppButton } from './WhatsAppButton';

// Temporarily off while the WebGPU city is being tuned: the comb halves every
// contrast behind it. Flip to `true` to bring the honeycomb back — nothing else
// needs changing, and `portfolio.css` still carries its (now translucent) rules.
const SHOW_HEXAGON_BACKGROUND = false;

export function PortfolioLanding() {
  const root = useRef<HTMLDivElement>(null);
  usePortfolioMotion(root);

  return (
    <>
      <CityBackground />
      {SHOW_HEXAGON_BACKGROUND ? <HexagonBackground /> : null}
      <div className="hbg-content" ref={root}>
        <Nav />
        <main>
          <Hero />
          <Projects />
          <AiSection />
          <Skills />
          <Experience />
          <Availability />
          <Contact />
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
    </>
  );
}
