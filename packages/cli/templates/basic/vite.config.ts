import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["@liteflow/ui"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
