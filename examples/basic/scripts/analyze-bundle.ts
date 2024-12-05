import { readFileSync } from "fs";
import { join } from "path";
import { gzipSync } from "zlib";
import { brotliCompressSync } from "zlib";
import chalk from "chalk";

interface BundleStats {
  fileName: string;
  size: number;
  gzipSize: number;
  brotliSize: number;
}

const BUNDLE_SIZE_LIMITS = {
  js: 200 * 1024, // 200KB
  css: 50 * 1024, // 50KB
  total: 500 * 1024, // 500KB
};

function formatSize(size: number): string {
  return `${(size / 1024).toFixed(2)} KB`;
}

function analyzeFile(filePath: string): BundleStats {
  const content = readFileSync(filePath);
  const gzipped = gzipSync(content);
  const brotli = brotliCompressSync(content);

  return {
    fileName: filePath.split("/").pop() || "",
    size: content.length,
    gzipSize: gzipped.length,
    brotliSize: brotli.length,
  };
}

function checkBundleSize(stats: BundleStats): boolean {
  const extension = stats.fileName.split(".").pop() || "";
  const limit =
    BUNDLE_SIZE_LIMITS[extension as keyof typeof BUNDLE_SIZE_LIMITS] ||
    BUNDLE_SIZE_LIMITS.total;

  return stats.size <= limit;
}

function printStats(stats: BundleStats): void {
  const isWithinLimit = checkBundleSize(stats);
  const sizeColor = isWithinLimit ? chalk.green : chalk.red;

  console.log(chalk.bold(`\n${stats.fileName}`));
  console.log(`Raw size:     ${sizeColor(formatSize(stats.size))}`);
  console.log(`Gzip size:    ${chalk.cyan(formatSize(stats.gzipSize))}`);
  console.log(`Brotli size:  ${chalk.cyan(formatSize(stats.brotliSize))}`);

  if (!isWithinLimit) {
    console.log(chalk.red(`⚠️  Bundle size exceeds limit!`));
  }
}

function analyzeBundles(): void {
  const distPath = join(process.cwd(), "dist");
  const bundles = ["index.js", "index.css", "vendor.js"].map((file) =>
    join(distPath, file)
  );

  let totalSize = 0;
  let totalGzipSize = 0;
  let totalBrotliSize = 0;

  bundles.forEach((bundle) => {
    try {
      const stats = analyzeFile(bundle);
      printStats(stats);

      totalSize += stats.size;
      totalGzipSize += stats.gzipSize;
      totalBrotliSize += stats.brotliSize;
    } catch (error) {
      console.error(chalk.red(`Error analyzing ${bundle}:`), error);
    }
  });

  console.log(chalk.bold("\nTotal sizes:"));
  console.log(`Raw:     ${formatSize(totalSize)}`);
  console.log(`Gzip:    ${formatSize(totalGzipSize)}`);
  console.log(`Brotli:  ${formatSize(totalBrotliSize)}`);

  if (totalSize > BUNDLE_SIZE_LIMITS.total) {
    console.log(chalk.red("\n⚠️  Total bundle size exceeds limit!"));
    process.exit(1);
  }
}

analyzeBundles();
