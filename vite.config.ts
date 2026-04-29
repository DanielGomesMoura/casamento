import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Adicione esta linha

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Adicione esta linha
  ],
  optimizeDeps: {
    include: ['lucide-react'], // Diz para o Vite compilar isso de forma otimizada
  },
})