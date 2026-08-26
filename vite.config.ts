import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    adonisjs({ entryPoints: ['inertia/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~': `${import.meta.dirname}/inertia`,
      '@': `${import.meta.dirname}/inertia`,
      '@views': `${import.meta.dirname}/inertia`,
      'next/navigation': `${import.meta.dirname}/inertia/lib/next-navigation-shim.ts`,
      'next/font/google': `${import.meta.dirname}/inertia/lib/next-font-shim.ts`,
      'next/link': `${import.meta.dirname}/inertia/lib/next-link-shim.tsx`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})
