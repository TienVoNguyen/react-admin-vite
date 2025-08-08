module.exports = {
  plugins: {
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          reduceIdents: false, // Keep class names readable
          zindex: false, // Don't optimize z-index values
        }]
      }
    } : {})
  }
}
