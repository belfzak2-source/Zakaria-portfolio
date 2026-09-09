import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'

// Safely load the site config using fs so Vercel doesn't crash
let siteConfiguration: FigmaSiteConfiguration = {}
const siteConfigPath = path.resolve(__dirname, './figma/make/site.json')
const fallbackConfigPath = path.resolve(__dirname, './.figma/make/site.json')

if (fs.existsSync(siteConfigPath)) {
  try { siteConfiguration = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8')) } catch (err) {}
} else if (fs.existsSync(fallbackConfigPath)) {
  try { siteConfiguration = JSON.parse(fs.readFileSync(fallbackConfigPath, 'utf-8')) } catch (err) {}
}

export default defineConfig(({ mode }) => {
  const emitSourcemaps = mode === 'development'

  return {
    base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
      react(),
      tailwindcss(),
      figmaSiteConfiguration(siteConfiguration),
      figmaErrorOverlayReplay(),
      figmaReactRefreshBoundaryFallback(),
      figmaMakeKitPlugin({ storiesGlob: '/src/**/*.stories.{ts,tsx,js,jsx}' }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
      strictPort: true,
      watch: { ignored: ['**/figma/**'] },
    },
    preview: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
    },
  }
})
