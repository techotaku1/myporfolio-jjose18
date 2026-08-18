import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Jose David Gonzalez — Full-Stack & IA Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Renders the social sharing card for the portfolio landing page.
 * @returns The generated 1200x630 Open Graph image response.
 */
export default function OpengraphImage() {
  const avatar = readFileSync(path.join(process.cwd(), 'public/pic_profile_avatar.jpg'));
  const avatarUri = `data:image/jpeg;base64,${avatar.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: 'linear-gradient(135deg, #0a0b10 0%, #111827 55%, #0a0b10 100%)',
        color: '#f8fafc',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <img
          src={avatarUri}
          width={132}
          height={132}
          alt=""
          style={{ borderRadius: '50%', border: '4px solid #38bdf8', objectFit: 'cover' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Jose David Gonzalez
          </div>
          <div style={{ fontSize: 30, color: '#38bdf8', marginTop: 8 }}>
            Full-Stack &amp; IA Developer
          </div>
        </div>
      </div>

      <div style={{ fontSize: 30, color: '#cbd5e1', marginTop: 48, lineHeight: 1.4 }}>
        React · Next.js · TypeScript · Python · FastAPI · Sistemas agénticos con IA
      </div>

      <div style={{ display: 'flex', fontSize: 24, color: '#64748b', marginTop: 24 }}>
        Cali, Colombia · Disponible para proyectos freelance
      </div>
    </div>,
    size,
  );
}
