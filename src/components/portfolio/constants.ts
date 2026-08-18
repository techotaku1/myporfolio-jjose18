/** Personal identity and the hero headline for the portfolio landing.
 * Single-language (Spanish) personal site, so this content lives as
 * typed constants rather than i18n message catalogs. */
export const PROFILE = {
  name: 'Jose David Gonzalez',
  email: 'jsdg1818@gmail.com',
  github: 'https://github.com/techotaku1',
  linkedin: 'https://www.linkedin.com/in/jjose18/',
  phone: '+57 324 114 9554',
  location: 'CALI · VALLE DEL CAUCA · CO',
} as const;

/** Prefilled WhatsApp text, so the first message already states the intent. */
const WHATSAPP_GREETING = 'Hola Jose David, vi tu portafolio y quiero cotizar una aplicación web.';

/** `PROFILE.phone` in E.164, the format WhatsApp links and structured data expect. */
export const PHONE_E164 = `+${PROFILE.phone.replaceAll(/\D/gu, '')}`;

/**
 * WhatsApp deep link for hiring enquiries.
 * The number is derived from `PROFILE.phone` so the displayed contact and the
 * link can never drift apart.
 */
export const WHATSAPP_URL = `https://wa.me/${PROFILE.phone.replaceAll(/\D/gu, '')}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;

/** Services offered, used for the hiring copy and the structured data. */
export const SERVICES = [
  {
    name: 'Aplicaciones web a medida',
    desc: 'Desarrollo de aplicaciones web completas con React, Next.js y TypeScript, desde el diseño de la interfaz hasta el despliegue en producción.',
  },
  {
    name: 'Landing pages y sitios corporativos',
    desc: 'Sitios rápidos y optimizados para buscadores, con métricas de rendimiento y SEO técnico cuidados desde el primer día.',
  },
  {
    name: 'Backends y APIs',
    desc: 'Servicios backend con Python y FastAPI, bases de datos PostgreSQL y almacenamiento en la nube sobre AWS.',
  },
  {
    name: 'Automatización con IA',
    desc: 'Flujos de trabajo automatizados con n8n e integración de modelos de lenguaje para eliminar tareas repetitivas.',
  },
] as const;

/** Hero headline. The last line renders with the gradient treatment. */
export const HEADLINE = ['FULL', 'STACK', 'IA_DEV_'] as const;
