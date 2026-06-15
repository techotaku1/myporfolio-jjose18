import Image from 'next/image';
import { Fragment } from 'react';
import { HEADLINE, PROFILE } from './constants';
import { BRAND_ICONS, STROKE_ICONS } from './data';
import { Icon } from './Icon';

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" />
      <div className="wrap hero-grid">
        <div>
          <div className="hero-intro">
            <div className="avatar">
              <span className="avatar-ring" aria-hidden="true" />
              <Image
                src="/pic_profile_avatar.jpg"
                alt={PROFILE.name}
                width={120}
                height={120}
                preload
                className="avatar-img"
              />
            </div>
            <span className="status-pill">
              <span className="ping" />
              SISTEMA ONLINE // DISPONIBLE PARA PROYECTOS
            </span>
          </div>
          <h1 className="display">
            {HEADLINE.map((line, i) => (
              <Fragment key={line}>
                {i === HEADLINE.length - 1 ? <span className="grad">{line}</span> : line}
                {i < HEADLINE.length - 1 && <br />}
              </Fragment>
            ))}
          </h1>
          <p className="lead">
            Tecnólogo en Sistemas y Desarrollador Full-Stack. Construyo plataformas de alto
            rendimiento con React, Next.js y FastAPI — y desarrollo de forma nativa con IA y
            sistemas agénticos.
          </p>
          <div className="hero-actions">
            <a href="#proyectos" className="btn">
              Ver proyectos <Icon d={STROKE_ICONS.arrow} stroke size={16} />
            </a>
            <div className="social-row">
              <a
                className="btn btn-ghost"
                href={PROFILE.github}
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
              >
                <Icon d={BRAND_ICONS.github} />
              </a>
              <a
                className="btn btn-ghost"
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
              >
                <Icon d={BRAND_ICONS.linkedin} />
              </a>
              <a className="btn btn-ghost" href={`mailto:${PROFILE.email}`} aria-label="Email">
                <Icon d={BRAND_ICONS.mail} />
              </a>
            </div>
          </div>
        </div>

        <div className="console" aria-hidden="true">
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
          <div className="row">
            <span>SYS.STATUS: NORMAL</span>
            <span>LOC: CALI · CO</span>
          </div>
          <div>
            <div className="bar">
              <i style={{ width: '92%' }} />
            </div>
            <div className="row" style={{ marginBottom: '1rem' }}>
              <span>FRONTEND_LOAD</span>
              <span>92%</span>
            </div>
            <div className="bar">
              <i style={{ width: '78%' }} />
            </div>
            <div className="row" style={{ marginBottom: '1rem' }}>
              <span>BACKEND_LOAD</span>
              <span>78%</span>
            </div>
            <div className="bar">
              <i style={{ width: '96%' }} />
            </div>
            <div className="row">
              <span>AI_WORKFLOW</span>
              <span>96%</span>
            </div>
          </div>
          <div className="bigstat">
            <b>03</b>
            <span>STACK_PRINCIPAL: NEXT · FASTAPI · IA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
