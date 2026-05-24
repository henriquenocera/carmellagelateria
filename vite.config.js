import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  appType: "spa",
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
  server: {
    watch: {
      ignored: ["**/build/**", "**/dist/**", "**/functions/**", "**/.ENV*"],
    },
  },
  optimizeDeps: {
    entries: ["index.html"],
  },
})
