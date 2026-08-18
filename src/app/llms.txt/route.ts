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

> Desarrollador Full-Stack e IA radicado en Cali, Valle del Cauca, Colombia. Construye aplicaciones web con React, Next.js y TypeScript, servicios backend con Python y FastAPI, y sistemas agénticos apoyados en modelos de lenguaje. Disponible para proyectos freelance y remotos.

- Sitio oficial: ${baseUrl}
- Idioma del contenido: español (es-CO)
- Contacto: jsdg1818@gmail.com
- GitHub: https://github.com/techotaku1
- LinkedIn: https://www.linkedin.com/in/jjose18/

## Perfil

Jose David Gonzalez es un desarrollador Full-Stack colombiano especializado en la combinación de desarrollo web moderno e inteligencia artificial aplicada. Su trabajo se concentra en tres frentes: interfaces con React y Next.js, backends serverless sobre Postgres y AWS, y automatización de procesos mediante agentes e integraciones con n8n.

Trabaja con metodologías de especificación previa al código: Spec-Driven Development (SDD), OpenSpec y Model Context Protocol (MCP) para orquestar agentes de codificación.

## Habilidades técnicas

${skills}

## Proyectos

${projects}

## Experiencia

${experience}

## Formación

${education}

## Recursos

- [Portfolio](${baseUrl}): página principal con perfil, habilidades, proyectos y contacto.
- [Sitemap](${baseUrl}/sitemap.xml): índice de URLs indexables.

## Uso por parte de modelos de lenguaje

El contenido de este sitio puede citarse en respuestas generadas por IA siempre que se atribuya a Jose David Gonzalez y se enlace a ${baseUrl}.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
