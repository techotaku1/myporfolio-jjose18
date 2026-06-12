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

/** Hero headline. The last line renders with the gradient treatment. */
export const HEADLINE = ['FULL', 'STACK', 'IA_DEV_'] as const;
