module.exports = {
   plugins: {
      // input.css içindeki @import'ları Tailwind çalışmadan önce çözer
      'postcss-import': {},
      tailwindcss: {},
      autoprefixer: {},
   },
}
