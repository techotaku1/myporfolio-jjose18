'use client';

import { useEffect } from 'react';
import { AiSection } from './AiSection';
import { Contact } from './Contact';
import { Experience } from './Experience';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { HexagonBackground } from './HexagonBackground';
import { Nav } from './Nav';
import { Projects } from './Projects';
import { ScrollProgress } from './ScrollProgress';
import { Skills } from './Skills';
import { WhatsAppButton } from './WhatsAppButton';

/** Reveals elements with the `.reveal` class as they scroll into view.
 * Syncs with the DOM via IntersectionObserver — a genuine external system. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );

    for (const el of els) {
      io.observe(el);
    }
    return () => {
      io.disconnect();
    };
  }, []);
}

export function PortfolioLanding() {
  useReveal();

  return (
    <>
      <ScrollProgress />
      <HexagonBackground />
      <div className="hbg-content">
        <Nav />
        <main>
          <Hero />
          <Projects />
          <AiSection />
          <Skills />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
    </>
  );
}
