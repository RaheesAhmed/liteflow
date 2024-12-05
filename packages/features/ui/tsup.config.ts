import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-dialog",
    "@radix-ui/react-slot",
    "@radix-ui/react-aspect-ratio",
    "@radix-ui/react-checkbox",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  treeshake: true,
  minify: true,
  outDir: "dist",
  platform: "browser",
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
    options.define = {
      'process.env.NODE_ENV': '"production"'
    };
  }
});
