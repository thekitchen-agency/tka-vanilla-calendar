import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      build: {
        outDir: 'dist',
        lib: {
          entry: 'src/index.js',
          name: 'TkaCalendar',
          fileName: 'tka-calendar'
        },
        rollupOptions: {
          external: ['date-fns', 'date-fns/locale'],
          output: {
            globals: {
              'date-fns': 'dateFns',
              'date-fns/locale': 'dateFnsLocale'
            }
          }
        }
      }
    }
  }

  // Demo / Site Build
  return {
    base: '/tka-vanilla-calendar/',
    build: {
      outDir: 'dist-site',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: 'index.html',
          playground: 'playground.html'
        }
      }
    }
  }
})
