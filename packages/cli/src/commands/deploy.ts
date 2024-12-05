import { execa } from "execa";
import { resolve } from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger";

type DeployPlatform = "vercel" | "netlify" | "aws";

interface DeployOptions {
  platform?: DeployPlatform;
  prod?: boolean;
  env?: string;
}

export async function deployCommand(options: DeployOptions = {}) {
  const { platform = "vercel", prod = false, env } = options;

  // Validate project
  const cwd = process.cwd();
  const pkgPath = resolve(cwd, "package.json");

  if (!(await fs.pathExists(pkgPath))) {
    logger.error(
      "No package.json found. Are you in a LiteFlow project directory?"
    );
    process.exit(1);
  }

  // Load environment variables if specified
  if (env) {
    const envPath = resolve(cwd, env);
    if (!(await fs.pathExists(envPath))) {
      logger.error("Environment file not found:", env);
      process.exit(1);
    }
    await loadEnvFile(envPath);
  }

  // Start deployment
  const spinner = logger.spinner(`Deploying to ${platform}...`);

  try {
    // Run build first
    spinner.stop("Building project...");
    await execa("npm", ["run", "build"], {
      cwd,
      stdio: "inherit",
    });

    // Deploy based on platform
    spinner.stop(`Deploying to ${platform}...`);

    switch (platform) {
      case "vercel":
        await deployToVercel(cwd, prod);
        break;
      case "netlify":
        await deployToNetlify(cwd, prod);
        break;
      case "aws":
        await deployToAWS(cwd, prod);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    spinner.stop("Deployment complete");
    logger.success("\nDeployment successful!");
  } catch (error) {
    spinner.stop();
    logger.error("Deployment failed:", error);
    process.exit(1);
  }
}

// Platform-specific deployment functions
async function deployToVercel(cwd: string, prod: boolean) {
  const args = ["deploy"];
  if (prod) args.push("--prod");

  try {
    await execa("vercel", args, {
      cwd,
      stdio: "inherit",
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      logger.error("Vercel CLI not found. Install it with: npm i -g vercel");
      process.exit(1);
    }
    throw error;
  }
}

async function deployToNetlify(cwd: string, prod: boolean) {
  const args = ["deploy"];
  if (prod) args.push("--prod");

  try {
    await execa("netlify", args, {
      cwd,
      stdio: "inherit",
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      logger.error(
        "Netlify CLI not found. Install it with: npm i -g netlify-cli"
      );
      process.exit(1);
    }
    throw error;
  }
}

async function deployToAWS(cwd: string, prod: boolean) {
  // Check for AWS credentials
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    logger.error(
      "AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
    );
    process.exit(1);
  }

  try {
    // Deploy using AWS CDK or other AWS deployment tool
    await execa(
      "aws",
      ["s3", "sync", "dist", `s3://your-bucket-${prod ? "prod" : "dev"}`],
      {
        cwd,
        stdio: "inherit",
      }
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      logger.error("AWS CLI not found. Install it with: npm i -g aws-cli");
      process.exit(1);
    }
    throw error;
  }
}

// Helper function to load environment variables
async function loadEnvFile(path: string) {
  const envContent = await fs.readFile(path, "utf-8");
  const envVars = parseEnv(envContent);

  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Helper function to parse environment variables
function parseEnv(content: string): Record<string, string> {
  const env: Record<string, string> = {};

  content.split("\n").forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith("#")) {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=");
      if (key && value) {
        env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
      }
    }
  });

  return env;
}
