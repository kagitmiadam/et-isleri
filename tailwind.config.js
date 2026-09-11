const plugin = require('tailwindcss/plugin')

/**
 * Bu config, elimizde kalan derlenmiş style.css'ten geri çıkarılmıştır.
 * Kanıtlar:
 *   - screens      : Tailwind bölgesindeki @media sorguları (desktop-first, max-width tabanlı)
 *   - container    : min-width 481/625/769/1025/1281/1441/1681/1921 sorguları
 *   - colors.main  : :root içindeki --main-50 ... --main-950 değerleri
 *   - plugins      : .scrollbar / .scrollbar-thin kuralları (tailwind-scrollbar)
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
   // Sınıf taraması: script.js runtime'da sınıf eklediği için o da taranmalı
   // (ör. max-w-[90dvw], aspect-[16/9], !translate-y-[125%])
   content: ['./*.html', './assets/js/**/*.js'],

   theme: {
      // DİKKAT: extend değil, tam değiştirme.
      // Şablon desktop-first; varsayılan min-width ekranlar kullanılmıyor.
      screens: {
         xs: { max: '480px' },
         xsm: { max: '624px' },
         sm: { max: '768px' },
         md: { max: '1024px' },
         lg: { max: '1280px' },
         xl: { max: '1440px' },

         'min-xs': { min: '481px' },
         'min-xsm': { min: '625px' },
         'min-sm': { min: '769px' },
         'min-md': { min: '1025px' },
         'min-lg': { min: '1281px' },
         'min-xl': { min: '1441px' },
         'min-2xl': { min: '1681px' },
         'min-3xl': { min: '1921px' },
      },

      extend: {
         colors: {
            main: {
               50: '#f6f6f6',
               100: '#e7e7e7',
               200: '#d1d1d1',
               300: '#b0b0b0',
               400: '#888888',
               500: '#6d6d6d',
               600: '#5d5d5d',
               700: '#4f4f4f',
               800: '#454545',
               900: '#3d3d3d',
               950: '#000000',
            },
         },

         // --- Markup'ta kullanılan ama derlenmiş CSS'te karşılığı olmayanlar ---
         // Bunlar şablona sonradan yazılmış, hiçbir build'e girmemiş sınıflar.
         zIndex: {
            1: '1',
            2: '2',
            3: '3',
            100: '100',
         },
         transitionDuration: {
            350: '350ms',
         },
         borderRadius: {
            // markup'ta rounded-0 geçiyor (Tailwind'in karşılığı rounded-none)
            0: '0px',
         },
         boxShadow: {
            // shadow-popup'ın orijinal değeri kayıp; makul bir varsayılan.
            popup: '0 10px 40px rgba(0, 0, 0, 0.15)',
         },
      },
   },

   plugins: [
      // nocompatible: scrollbar-w-*, scrollbar-h-* ve scrollbar-*-rounded-*
      // yardımcıları yalnızca bu seçenekle üretilir. Eski style.css'te
      // scrollbar-w-[4px] / scrollbar-thumb-rounded-none vardı; markup hâlâ
      // kullanıyor, o yüzden açık.
      require('tailwind-scrollbar')({ nocompatible: true }),

      // Tailwind v3'te translate-z yok. Eski style.css'te .translate-z-0
      // kuralı vardı ve markup 3 yerde kullanıyor (satır 222, 350, 365).
      // Orijinal çıktıyla aynı transform zincirini yeniden üretir.
      plugin(function ({ matchUtilities, theme }) {
         matchUtilities(
            {
               'translate-z': (value) => ({
                  '--tw-translate-z': value,
                  transform: [
                     'translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z))',
                     'rotate(var(--tw-rotate))',
                     'skew(var(--tw-skew-x))',
                     'skewY(var(--tw-skew-y))',
                     'scaleX(var(--tw-scale-x))',
                     'scaleY(var(--tw-scale-y))',
                  ].join(' '),
               }),
            },
            { values: theme('translate'), supportsNegativeValues: true },
         )
      }),
   ],
}
