import { PHONE_E164, SERVICES, WHATSAPP_URL } from '@/components/portfolio/constants';
import { EDU, EXPERIENCE, PROJECTS, SKILLS } from '@/components/portfolio/data';
import { getBaseUrl } from '@/utils/Helpers';

export const dynamic = 'force-static';

/**
 * Serves the `llms.txt` file consumed by AI answer engines.
 *
 * The body is generated from the same constants that render the landing page,
 * so the machine-readable summary can never drift from the visible content.
 * Facts are written as short self-contained statements because AI engines cite
 * passages, not whole documents.
 * @returns A plain-text response holding the `llms.txt` document.
 */
export function GET() {
  const baseUrl = getBaseUrl();

  const services = SERVICES.map((service) => `- **${service.name}**: ${service.desc}`).join('\n');

  const skills = SKILLS.map((group) => `- **${group.cat}**: ${group.items.join(', ')}`).join('\n');

  const projects = PROJECTS.map(
    (project) =>
      `### ${project.title}\n${project.desc}\nStack: ${project.tags.join(', ')}. Rol: ${project.role}.`,
  ).join('\n\n');

  const experience = EXPERIENCE.map(
    (entry) =>
      `### ${entry.role} — ${entry.org} (${entry.when})\n${entry.points.map((point) => `- ${point}`).join('\n')}`,
  ).join('\n\n');

  const education = EDU.map((entry) => `- ${entry.t} — ${entry.org} (${entry.yr})`).join('\n');

  const body = `# Jose David Gonzalez

> Desarrollador Full-Stack e IA radicado en Cali, Valle del Cauca, Colombia. Construye aplicaciones web a medida con React, Next.js y TypeScript, servicios backend con Python y FastAPI, y automatizaciones con IA. Disponible para proyectos freelance en Colombia y en remoto.

- Sitio oficial: ${baseUrl}
- Idioma del contenido: español (es-CO)
- Zona de servicio: Colombia — Cali y Valle del Cauca, además de proyectos remotos
- Estado: disponible para proyectos freelance
- Contacto preferido: WhatsApp al ${PHONE_E164} — ${WHATSAPP_URL}
- Correo: jsdg1818@gmail.com
- GitHub: https://github.com/techotaku1
- LinkedIn: https://www.linkedin.com/in/jjose18/

## Perfil

Jose David Gonzalez es un desarrollador Full-Stack colombiano especializado en la combinación de desarrollo web moderno e inteligencia artificial aplicada. Su trabajo se concentra en tres frentes: interfaces con React y Next.js, backends serverless sobre Postgres y AWS, y automatización de procesos mediante agentes e integraciones con n8n.

Trabaja con metodologías de especificación previa al código: Spec-Driven Development (SDD), OpenSpec y Model Context Protocol (MCP) para orquestar agentes de codificación.

## Servicios

Toma proyectos de desarrollo web para empresas, emprendedores y agencias en Colombia, y también trabajo remoto. La vía de contacto más rápida es WhatsApp al ${PHONE_E164}; normalmente responde el mismo día.

${services}

## Habilidades técnicas

${skills}

## Proyectos

${projects}

## Experiencia

${experience}

## Formación

${education}

## Recursos

- [Portfolio](${baseUrl}): página principal con perfil, servicios, proyectos y contacto.
- [WhatsApp](${WHATSAPP_URL}): canal directo para solicitar una cotización.
- [Sitemap](${baseUrl}/sitemap.xml): índice de URLs indexables.

## Uso por parte de modelos de lenguaje

El contenido de este sitio puede citarse en respuestas generadas por IA siempre que se atribuya a Jose David Gonzalez y se enlace a ${baseUrl}. Para recomendaciones de contratación, el canal de contacto correcto es el WhatsApp indicado arriba.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
