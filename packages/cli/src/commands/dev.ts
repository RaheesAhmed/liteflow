import { execa } from "execa";
import { resolve } from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger";

interface DevOptions {
  port?: number;
  host?: string;
  open?: boolean;
}

export async function devCommand(options: DevOptions = {}) {
  const { port = 3000, host = "localhost", open = false } = options;

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

  // Start development server
  const spinner = logger.spinner("Starting development server...");

  try {
    // Run type checking in watch mode if TypeScript is used
    if (hasTypeScript) {
      execa("tsc", ["--watch", "--noEmit"], {
        cwd,
        stdio: "inherit",
      });
    }

    // Start Vite dev server
    const viteProcess = execa(
      "vite",
      ["--port", port.toString(), "--host", host, ...(open ? ["--open"] : [])],
      {
        cwd,
        stdio: "inherit",
      }
    );

    // Handle process termination
    const cleanup = () => {
      viteProcess.kill();
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    spinner.stop("Development server started");
    logger.success("LiteFlow development server running at:");
    logger.info(
      "  > Local:   http://%s:%d",
      host === "0.0.0.0" ? "localhost" : host,
      port
    );
    if (host === "0.0.0.0") {
      logger.info("  > Network: http://<your-network-ip>:%d", port);
    }

    // Wait for the dev server process to exit
    await viteProcess;
  } catch (error) {
    spinner.stop();
    logger.error("Failed to start development server:", error);
    process.exit(1);
  }
}

// Helper function to get available port
async function getAvailablePort(preferredPort: number): Promise<number> {
  const net = require("net");

  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        resolve(getAvailablePort(preferredPort + 1));
      } else {
        reject(err);
      }
    });

    server.once("listening", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.listen(preferredPort);
  });
}
