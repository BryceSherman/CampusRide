/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#666666',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-red-100',
    'text-red-600',
    'bg-green-100',
    'text-green-600',
    'bg-yellow-100',
    'text-yellow-600',
    'bg-blue-100',
    'text-blue-600',
  ],
}
