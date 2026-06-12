/** Static content and SVG path data for the portfolio landing.
 * Ported from the Claude Design handoff (data.jsx). */

/** Filled brand icon paths (rendered with fill). */
export const BRAND_ICONS = {
  github:
    'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z',
  mail: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 2.4V18h18V7.4l-9 5.6-9-5.6Z',
} as const;

/** Stroke (outline) icon paths. */
export const STROKE_ICONS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  ext: 'M14 4h6v6M20 4 10 14M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6',
  code: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  db: 'M12 3c4.4 0 8 1.34 8 3s-3.6 3-8 3-8-1.34-8-3 3.6-3 8-3ZM4 6v12c0 1.66 3.6 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.6 3 8 3s8-1.34 8-3',
  cpu: 'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M6 6h12v12H6zM9 9h6v6H9z',
  term: 'm4 6 5 5-5 5M12 18h8',
  bot: 'M12 3v3M7 7h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2ZM9 13h.01M15 13h.01M2 11v4M22 11v4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
} as const;

export type ProjectArtType = 'social' | 'flow' | 'window';

export type Project = {
  title: string;
  art: ProjectArtType;
  desc: string;
  tags: string[];
  role: string;
};

export const PROJECTS: Project[] = [
  {
    title: 'Plataforma EdTech Social',
    art: 'social',
    desc: 'Ecosistema educativo impulsado por IA donde los estudiantes no solo consumen cursos, sino que comparten y colaboran en proyectos a través de un social feed dinámico en tiempo real.',
    tags: ['Next.js 16', 'Shadcn/UI', 'Neon · Postgres', 'Drizzle ORM', 'AWS S3', 'Clerk'],
    role: 'Full-Stack · Remoto',
  },
  {
    title: 'Automatización de Workflows',
    art: 'flow',
    desc: 'Diseño e implementación de flujos de trabajo automatizados con n8n, conectando servicios y procesos para eliminar tareas repetitivas e integrar IA generativa en el pipeline.',
    tags: ['n8n', 'Webhooks', 'APIs', 'IA Generativa'],
    role: 'Automatización',
  },
  {
    title: 'Apps Web Freelance',
    art: 'window',
    desc: 'Desarrollo de aplicaciones web a medida con React y Next.js, con backend sobre AWS y SQLite, enfocadas en rendimiento, SEO y experiencia de usuario responsive.',
    tags: ['React', 'Next.js', 'AWS', 'SQLite', 'SEO'],
    role: 'Freelance · 2024',
  },
];

export type AiTool = { n: string; name: string; desc: string };

export const AI_TOOLS: AiTool[] = [
  {
    n: '01',
    name: 'Claude Code',
    desc: 'Desarrollo asistido por agentes en terminal: refactors, features completas y revisión de código de extremo a extremo.',
  },
  {
    n: '02',
    name: 'Gemini CLI',
    desc: 'Generación y análisis de código desde la línea de comandos, integrado al flujo diario de desarrollo.',
  },
  {
    n: '03',
    name: 'Codex',
    desc: 'Pair-programming con IA para acelerar prototipos, tests y resolución de bugs.',
  },
  {
    n: '04',
    name: 'OpenCode',
    desc: 'Entorno de codificación agéntico open-source para tareas autónomas sobre el repositorio.',
  },
  {
    n: '05',
    name: 'GitHub Copilot',
    desc: 'Autocompletado contextual y sugerencias dentro del editor para mantener el ritmo de entrega.',
  },
  {
    n: '06',
    name: 'VS Code + Agentes',
    desc: 'Editor configurado con sistemas agénticos y herramientas MCP para orquestar tareas complejas.',
  },
];

export type Method = { b: string; s: string };

export const METHODS: Method[] = [
  {
    b: 'SDD',
    s: 'Spec-Driven Development — la especificación guía cada feature antes de escribir código.',
  },
  {
    b: 'OpenSpec',
    s: 'Desarrollo dirigido por OpenSpec: contratos claros entre intención y ejecución.',
  },
  {
    b: 'MCP',
    s: 'Minimum Competent Product y Model Context Protocol para planificar y conectar agentes.',
  },
  {
    b: 'Sistemas agénticos',
    s: 'Orquestación de agentes autónomos que ejecutan, verifican e iteran sobre el código.',
  },
];

export type SkillGroup = { cat: string; items: string[] };

export const SKILLS: SkillGroup[] = [
  {
    cat: 'Frontend',
    items: [
      'React',
      'Next.js (SSR/SSG)',
      'TypeScript',
      'Tailwind CSS',
      'Shadcn/UI',
      'HTML5 · CSS3',
    ],
  },
  {
    cat: 'Backend',
    items: ['FastAPI (Python)', 'Neon · Postgres', 'Drizzle ORM', 'SQLite', 'AWS S3'],
  },
  {
    cat: 'IA & Ops',
    items: [
      'Claude Code · Codex',
      'Gemini CLI · OpenCode',
      'n8n · Workflows',
      'Machine Learning',
      'Vercel · Upstash',
    ],
  },
];

export type TechBadge = { label: string; icon: string; invert?: true };

export const TECH_BADGES: TechBadge[] = [
  { label: 'React', icon: 'react.svg' },
  { label: 'Next.js', icon: 'nextjs.svg' },
  { label: 'TypeScript', icon: 'typescript.svg' },
  { label: 'JavaScript', icon: 'javascript.svg' },
  { label: 'Tailwind CSS', icon: 'tailwindcss.svg' },
  { label: 'Python', icon: 'python.svg' },
  { label: 'Neon', icon: 'neon-icon.svg' },
  { label: 'Vercel', icon: 'vercel-fill.svg', invert: true },
  { label: 'VS Code', icon: 'vscode.svg' },
  { label: 'ESLint', icon: 'eslint.svg' },
  { label: 'Prettier', icon: 'prettier.svg' },
  { label: 'Claude', icon: 'claude.svg' },
  { label: 'ChatGPT', icon: 'openai-chatgpt.svg', invert: true },
  { label: 'Gemini', icon: 'file-type-gemini.svg' },
];

export type ExperienceEntry = { when: string; role: string; org: string; points: string[] };

export const EXPERIENCE: ExperienceEntry[] = [
  {
    when: '2024 — Actualidad',
    role: 'Desarrollador Full-Stack (Next.js & IA)',
    org: 'Plataforma Educativa Social · Remoto',
    points: [
      'Desarrollo de una plataforma EdTech impulsada por IA con social feed colaborativo en tiempo real.',
      'Next.js 16 + Shadcn/UI priorizando velocidad de carga e interactividad.',
      'Servicios serverless: Neon (Postgres), Drizzle ORM y AWS S3 para activos multimedia.',
      'Programación asistida por IA (Claude Code, Copilot) para acelerar la entrega y la calidad.',
    ],
  },
  {
    when: '2024',
    role: 'Desarrollador Web Freelancer',
    org: 'Independiente',
    points: ['Aplicaciones web con React y Next.js.', 'Soluciones backend con AWS y SQLite.'],
  },
  {
    when: '2023 — Presente',
    role: 'Edición de Video & Diseño',
    org: 'Freelance · CapCut · Canva',
    points: [
      'Edición y optimización de contenido audiovisual para redes sociales.',
      'Presentaciones profesionales y material de marketing en Canva.',
    ],
  },
  {
    when: '2014',
    role: 'Técnico en Mantenimiento e Instalación',
    org: 'Freelance',
    points: [
      'Mantenimiento preventivo y correctivo de hardware y software (Windows / Linux).',
      'Soporte en redes y recuperación de datos.',
    ],
  },
];

export type EducationEntry = { t: string; org: string; yr: string };

export const EDU: EducationEntry[] = [
  { t: 'Tecnólogo en Sistemas', org: 'FCECEP', yr: '2011 — 2014' },
  { t: 'Técnico en Desarrollo de Software', org: 'Finalizado', yr: 'Marzo 2024' },
  { t: 'Machine Learning', org: 'Instituto Ponao', yr: 'Marzo 2024' },
];
