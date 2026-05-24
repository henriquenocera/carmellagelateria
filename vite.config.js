import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "REACT_APP_"],
  appType: "spa",
  build: {
    outDir: "build",
    rollupOptions: {
      input: "index.html",
    },
  },
  server: {
    watch: {
      ignored: ["**/build/**", "**/functions/**", "**/.ENV*"],
    },
  },
  optimizeDeps: {
    entries: ["index.html"],
  },
})
