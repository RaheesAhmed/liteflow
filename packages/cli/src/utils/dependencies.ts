import { execSync } from "child_process";
import { logger } from "./logger";

interface DependencyOptions {
  dependencies?: string[];
  devDependencies?: string[];
}

export async function installDependencies(
  projectPath: string,
  packageManager: "npm" | "yarn" | "pnpm",
  options: DependencyOptions
): Promise<void> {
  const { dependencies = [], devDependencies = [] } = options;

  try {
    // Install production dependencies
    if (dependencies.length > 0) {
      logger.info("Installing production dependencies...");
      const installCmd = getInstallCommand(packageManager, false);
      execSync(`${installCmd} ${dependencies.join(" ")}`, {
        cwd: projectPath,
        stdio: "inherit",
      });
    }

    // Install development dependencies
    if (devDependencies.length > 0) {
      logger.info("Installing development dependencies...");
      const installCmd = getInstallCommand(packageManager, true);
      execSync(`${installCmd} ${devDependencies.join(" ")}`, {
        cwd: projectPath,
        stdio: "inherit",
      });
    }
  } catch (error) {
    logger.error("Failed to install dependencies:", error);
    throw new Error("Dependency installation failed");
  }
}

function getInstallCommand(
  packageManager: "npm" | "yarn" | "pnpm",
  isDev: boolean
): string {
  switch (packageManager) {
    case "npm":
      return `npm install ${isDev ? "--save-dev" : "--save"}`;
    case "yarn":
      return `yarn add ${isDev ? "--dev" : ""}`;
    case "pnpm":
      return `pnpm add ${isDev ? "--save-dev" : ""}`;
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}

export function checkDependencies(projectPath: string): void {
  try {
    // Check if node_modules exists
    execSync("node -v", { cwd: projectPath });
  } catch (error) {
    throw new Error("Node.js is not installed. Please install Node.js first.");
  }

  try {
    // Check package.json
    require(`${projectPath}/package.json`);
  } catch (error) {
    throw new Error("Invalid package.json file.");
  }
}

export function updateDependencies(
  projectPath: string,
  packageManager: "npm" | "yarn" | "pnpm"
): void {
  try {
    logger.info("Updating dependencies...");
    const updateCmd = getUpdateCommand(packageManager);
    execSync(updateCmd, {
      cwd: projectPath,
      stdio: "inherit",
    });
  } catch (error) {
    logger.error("Failed to update dependencies:", error);
    throw new Error("Dependency update failed");
  }
}

function getUpdateCommand(packageManager: "npm" | "yarn" | "pnpm"): string {
  switch (packageManager) {
    case "npm":
      return "npm update";
    case "yarn":
      return "yarn upgrade";
    case "pnpm":
      return "pnpm update";
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}
