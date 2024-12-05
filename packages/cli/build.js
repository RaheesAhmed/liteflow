const esbuild = require("esbuild");
const { rimraf } = require("rimraf");
const { resolve } = require("path");
const fs = require("fs");

// Clean dist directory
rimraf.sync("dist");

// Build configuration
const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "dist/index.js",
  minify: true,
  sourcemap: false,
  metafile: true,
  packages: "external",
  banner: {
    js: "#!/usr/bin/env node",
  },
};

try {
  // Build
  esbuild
    .build(config)
    .then((result) => {
      // Set executable permissions
      fs.chmodSync("dist/index.js", "755");

      // Log build stats
      const { outputs } = result.metafile;
      const totalSize = Object.values(outputs).reduce(
        (sum, { bytes }) => sum + bytes,
        0
      );

      console.log("\nBuild completed successfully! 🎉");
      console.log("Total size:", (totalSize / 1024).toFixed(2), "KB\n");

      // Development mode
      if (process.argv.includes("--watch")) {
        esbuild.context(config).then((ctx) => {
          ctx.watch();
          console.log("Watching for changes...\n");
        });
      }
    })
    .catch((error) => {
      console.error("Build failed:", error);
      process.exit(1);
    });
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}
