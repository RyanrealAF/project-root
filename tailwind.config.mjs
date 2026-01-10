// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'matte-black': '#0A0A0A',
        'charcoal': '#1A1A1A',
        'charcoal-light': '#2A2A2A',
        'bronze': '#CD7F32',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        'fast': '200ms',
      },
    },
  },
  plugins: [],
}