'use client';

import { useRef } from 'react';
import { AiSection } from './AiSection';
import { Availability } from './Availability';
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

export function PortfolioLanding() {
  const root = useRef<HTMLDivElement>(null);
  usePortfolioMotion(root);

  return (
    <>
      <HexagonBackground />
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
