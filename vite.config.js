import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';

  if (isLib) {
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

  return {
    base: './',
    build: {
      outDir: 'dist-demo',
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
