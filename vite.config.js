import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  // Use mode to differentiate builds
  if (mode === 'lib') {
    return {
      build: {
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
      outDir: 'dist',
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
