import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  clean: true,
  minify: false,
  splitting: false,
  sourcemap: true,
  shims: true,
  dts: true,
  platform: "node",
  target: "node18",
  noExternal: [
    "chalk",
    "commander",
    "execa",
    "fs-extra",
    "gradient-string",
    "inquirer",
    "ora",
  ],
});
