/**
 * SVGO configuration for cleaning/minifying static SVG assets.
 * Safe defaults: preserves viewBox (needed for scaling in <img>/icons) and
 * leaves currentColor-based fills untouched so themed icons keep working.
 */
export default {
  multipass: true,
  js2svg: {
    indent: 2,
    pretty: false,
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox — removing it breaks responsive scaling
          removeViewBox: false,
        },
      },
    },
  ],
};
