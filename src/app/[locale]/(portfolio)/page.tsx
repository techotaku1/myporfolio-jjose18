import type { Metadata } from 'next';
import { PHONE_E164, SERVICES, WHATSAPP_URL } from '@/components/portfolio/constants';
import { PortfolioLanding } from '@/components/portfolio/PortfolioLanding';
import { getBaseUrl } from '@/utils/Helpers';

const BASE_URL = getBaseUrl();

const DESCRIPTION =
  'Full-Stack & AI Developer freelance en Cali, Colombia. Apps web con React, Next.js y Python para empresas de Colombia, EE. UU. y España, en remoto.';

export const metadata: Metadata = {
  // `absolute` skips the layout's `%s | Jose David Gonzalez` template, which would repeat the name
  title: { absolute: 'Jose David Gonzalez — Full-Stack & AI Developer' },
  description: DESCRIPTION,
  keywords: [
    'Jose David Gonzalez',
    'desarrollador full-stack',
    'AI developer',
    'freelance full-stack developer',
    'remote Next.js developer',
    'hire React developer',
    'nearshore developer Colombia',
    'Claude Code',
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'FastAPI',
    'sistemas agénticos',
    'inteligencia artificial',
    'desarrollador web Cali',
    'desarrollador web Colombia',
    'crear aplicacion web Colombia',
    'programador freelance Cali',
    'desarrollo de paginas web Valle del Cauca',
    'Colombia',
    'freelance',
  ],
  authors: [{ name: 'Jose David Gonzalez', url: BASE_URL }],
  creator: 'Jose David Gonzalez',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'profile',
    locale: 'es_CO',
    url: BASE_URL,
    siteName: 'Jose David Gonzalez — Portfolio',
    title: 'Jose David Gonzalez — Full-Stack & AI Developer',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jose David Gonzalez — Full-Stack & AI Developer',
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': 160,
      'max-image-preview': 'large',
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: 'Jose David Gonzalez',
      url: BASE_URL,
      image: `${BASE_URL}/pic_profile_avatar.jpg`,
      jobTitle: 'Full-Stack & AI Developer',
      description:
        'Desarrollador Full-Stack especializado en React, Next.js, TypeScript y Python, que trabaja de forma nativa con agentes, skills y subagentes de IA. Freelance remoto para Colombia, EE. UU. y España.',
      worksFor: { '@type': 'Organization', name: 'Freelance' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cali',
        addressRegion: 'Valle del Cauca',
        addressCountry: 'CO',
      },
      email: 'jsdg1818@gmail.com',
      telephone: PHONE_E164,
      sameAs: ['https://github.com/techotaku1', 'https://www.linkedin.com/in/jjose18/'],
      nationality: { '@type': 'Country', name: 'Colombia' },
      knowsLanguage: [
        { '@type': 'Language', name: 'Español', alternateName: 'es' },
        { '@type': 'Language', name: 'Inglés', alternateName: 'en' },
      ],
      alumniOf: [
        { '@type': 'EducationalOrganization', name: 'FCECEP' },
        { '@type': 'EducationalOrganization', name: 'Instituto Ponao' },
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Full-Stack & AI Developer',
        occupationLocation: { '@type': 'City', name: 'Cali, Colombia' },
        skills:
          'React, Next.js, TypeScript, Python, FastAPI, Claude Code, skills y subagentes de IA, MCP',
      },
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'Python',
        'FastAPI',
        'Inteligencia Artificial',
        'Sistemas Agénticos',
        'Claude Code',
        'Agent Skills',
        'Subagentes de IA',
        'Model Context Protocol',
        'Full-Stack Development',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${BASE_URL}/#service`,
      name: 'Jose David Gonzalez — Desarrollo de aplicaciones web',
      description:
        'Desarrollo de aplicaciones web a medida, landing pages, backends y automatizaciones con IA para empresas y emprendedores de Colombia, Estados Unidos y España, en remoto.',
      url: BASE_URL,
      image: `${BASE_URL}/pic_profile_avatar.jpg`,
      provider: { '@id': `${BASE_URL}/#person` },
      telephone: PHONE_E164,
      email: 'jsdg1818@gmail.com',
      priceRange: '$$',
      availableLanguage: ['es', 'en'],
      areaServed: [
        { '@type': 'Country', name: 'Colombia' },
        { '@type': 'City', name: 'Cali' },
        { '@type': 'State', name: 'Valle del Cauca' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'Spain' },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cali',
        addressRegion: 'Valle del Cauca',
        addressCountry: 'CO',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: PHONE_E164,
        email: 'jsdg1818@gmail.com',
        availableLanguage: ['es', 'en'],
        url: WHATSAPP_URL,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios de desarrollo web',
        itemListElement: SERVICES.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.desc,
            areaServed: [
              { '@type': 'Country', name: 'Colombia' },
              { '@type': 'Country', name: 'United States' },
              { '@type': 'Country', name: 'Spain' },
            ],
          },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Jose David Gonzalez — Portfolio',
      description: 'Portfolio personal de Jose David Gonzalez, desarrollador Full-Stack & AI.',
      author: { '@id': `${BASE_URL}/#person` },
      inLanguage: 'es-CO',
    },
    {
      '@type': 'ProfilePage',
      '@id': `${BASE_URL}/#profilepage`,
      url: BASE_URL,
      name: 'Jose David Gonzalez — Full-Stack & AI Developer',
      description: DESCRIPTION,
      inLanguage: 'es-CO',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      mainEntity: { '@id': `${BASE_URL}/#person` },
      primaryImageOfPage: `${BASE_URL}/pic_profile_avatar.jpg`,
    },
  ],
};

export default function PortfolioHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c') }}
      />
      <PortfolioLanding />
    </>
  );
}
