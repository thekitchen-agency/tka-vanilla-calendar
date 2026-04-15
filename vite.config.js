import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';

  if (isLib) {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.js'),
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
    base: '/tka-vanilla-calendar/',
    build: {
      outDir: 'dist-demo',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          playground: resolve(__dirname, 'playground.html')
        }
      }
    }
  }
})
