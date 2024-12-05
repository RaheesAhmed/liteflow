import { execa } from "execa";
import { resolve } from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger";

interface BuildOptions {
  analyze?: boolean;
  minify?: boolean;
  sourcemap?: boolean;
}

export async function buildCommand(options: BuildOptions = {}) {
  const { analyze = false, minify = true, sourcemap = false } = options;

  // Validate project
  const cwd = process.cwd();
  const pkgPath = resolve(cwd, "package.json");

  if (!(await fs.pathExists(pkgPath))) {
    logger.error(
      "No package.json found. Are you in a LiteFlow project directory?"
    );
    process.exit(1);
  }

  // Read package.json to determine project type
  const pkg = await fs.readJson(pkgPath);
  const hasTypeScript = await fs.pathExists(resolve(cwd, "tsconfig.json"));

  // Start build process
  const spinner = logger.spinner("Building for production...");

  try {
    // Run type checking
    if (hasTypeScript) {
      spinner.stop("Running type check...");
      await execa("tsc", ["--noEmit"], {
        cwd,
        stdio: "inherit",
      });
    }

    // Clean dist directory
    await fs.remove(resolve(cwd, "dist"));

    // Build with Vite
    spinner.stop("Building...");
    const buildArgs = [
      "build",
      "--mode",
      "production",
      ...(minify ? [] : ["--no-minify"]),
      ...(sourcemap ? ["--sourcemap"] : []),
    ];

    await execa("vite", buildArgs, {
      cwd,
      stdio: "inherit",
    });

    // Run bundle analyzer if requested
    if (analyze) {
      spinner.stop("Analyzing bundle...");
      await analyzeBuild(cwd);
    }

    // Calculate bundle size
    const stats = await getBuildStats(cwd);

    spinner.stop("Build complete");
    logger.success("\nBuild completed successfully!");
    logger.info("\nBundle size:");
    Object.entries(stats).forEach(([file, size]) => {
      logger.info("  %s: %s", file, formatBytes(size));
    });

    logger.info("\nThe build is ready to be deployed!");
    logger.info("  > Preview: npm run preview");
    logger.info("  > Deploy:  npm run deploy\n");
  } catch (error) {
    spinner.stop();
    logger.error("Build failed:", error);
    process.exit(1);
  }
}

// Helper function to analyze bundle
async function analyzeBuild(cwd: string) {
  try {
    await execa("vite-bundle-analyzer", {
      cwd,
      stdio: "inherit",
    });
  } catch (error) {
    logger.warning(
      "Bundle analyzer not available. Install with: npm i -D vite-bundle-analyzer"
    );
  }
}

// Helper function to get build stats
async function getBuildStats(cwd: string): Promise<Record<string, number>> {
  const stats: Record<string, number> = {};
  const distDir = resolve(cwd, "dist");

  if (await fs.pathExists(distDir)) {
    const files = await fs.readdir(distDir);

    for (const file of files) {
      if (file.endsWith(".js") || file.endsWith(".css")) {
        const filePath = resolve(distDir, file);
        const { size } = await fs.stat(filePath);
        stats[file] = size;
      }
    }
  }

  return stats;
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
