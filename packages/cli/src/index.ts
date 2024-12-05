#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import ora from "ora";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// Check if package manager is installed
async function isPackageManagerInstalled(packageManager: string) {
  try {
    await execa(packageManager, ["--version"]);
    return true;
  } catch {
    return false;
  }
}

// Install package manager if needed
async function ensurePackageManager(packageManager: string) {
  if (await isPackageManagerInstalled(packageManager)) {
    return true;
  }

  console.log(
    chalk.yellow(
      `\n${packageManager} is not installed. Installing it globally...\n`
    )
  );

  try {
    if (packageManager === "pnpm") {
      await execa("npm", ["install", "-g", "pnpm"]);
    } else if (packageManager === "yarn") {
      await execa("npm", ["install", "-g", "yarn"]);
    }
    return true;
  } catch (error) {
    console.error(
      chalk.red(
        `Failed to install ${packageManager}. Please install it manually.`
      )
    );
    return false;
  }
}

// Install dependencies using the selected package manager
async function installDependencies(projectDir: string, packageManager: string) {
  const spinner = ora({
    text: "Installing dependencies...",
    spinner: "dots",
  }).start();

  try {
    // Ensure the package manager is installed
    if (!(await ensurePackageManager(packageManager))) {
      spinner.fail("Failed to ensure package manager");
      return false;
    }

    // Run the install command
    await execa(packageManager, ["install"], {
      cwd: projectDir,
      stdio: "pipe", // Capture output
    });

    spinner.succeed("Dependencies installed successfully!");
    return true;
  } catch (error) {
    spinner.fail("Failed to install dependencies");
    if (error instanceof Error) {
      console.error(chalk.red("\nError details:"), error.message);
    }
    return false;
  }
}

// ASCII art banner
const banner = `
██╗     ██╗████████╗███████╗███████╗██╗      ██████╗ ██╗    ██╗
██║     ██║╚══██╔══╝██╔════╝██╔════╝██║     ██╔═══██╗██║    ██║
██║     ██║   ██║   █████╗  █████╗  ██║     ██║   ██║██║ █╗ ██║
██║     ██║   ██║   ██╔══╝  ██╔══╝  ██║     ██║   ██║██║███╗██║
███████╗██║   ██║   ███████╗██║     ███████╗╚██████╔╝╚███╔███╔╝
╚══════╝╚═╝   ╚═╝   ╚══════╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ 
`;

console.log(gradient.pastel.multiline(banner));
console.log(chalk.cyan("Welcome to LiteFlow - The Modern Web Framework\n"));

program
  .name("create-liteflow")
  .description("Create a new LiteFlow application")
  .version("0.1.3")
  .argument("[directory]", "Directory to create the project in")
  .action(async (directory) => {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "What is your project named?",
        default: directory || "my-liteflow-app",
        validate: (input: string) => {
          if (/^[a-zA-Z0-9-_]+$/.test(input)) return true;
          return "Project name may only include letters, numbers, underscores and hashes.";
        },
      },
      {
        type: "list",
        name: "template",
        message: "Which template would you like to use?",
        choices: [
          { name: "Basic (Simple starter template)", value: "basic" },
          { name: "Enterprise (Full-featured template)", value: "enterprise" },
          { name: "E-commerce (Online store template)", value: "e-commerce" },
        ],
      },
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager would you like to use?",
        choices: [
          { name: "pnpm (Recommended)", value: "pnpm" },
          { name: "npm", value: "npm" },
          { name: "yarn", value: "yarn" },
        ],
      },
    ]);

    const projectDir = path.resolve(process.cwd(), answers.projectName);
    const templateDir = path.resolve(
      __dirname,
      "..",
      "templates",
      answers.template
    );

    const spinner = ora({
      text: "Creating your LiteFlow project...",
      spinner: "dots",
    }).start();

    try {
      // Create project directory
      await fs.ensureDir(projectDir);

      // Check if template exists
      if (!(await fs.pathExists(templateDir))) {
        throw new Error(
          `Template '${answers.template}' not found. Only the 'basic' template is currently available.`
        );
      }

      // Copy template
      await fs.copy(templateDir, projectDir);

      // Update package.json
      const packageJsonPath = path.join(projectDir, "package.json");
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = answers.projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      spinner.succeed("Project created successfully!");

      // Install dependencies
      const installSuccess = await installDependencies(
        projectDir,
        answers.packageManager
      );

      if (installSuccess) {
        // Show success message
        console.log(
          "\n" +
            chalk.green("Success!") +
            " Created " +
            chalk.cyan(answers.projectName) +
            " at " +
            chalk.cyan(projectDir)
        );
        console.log("\nNext steps:");
        console.log(chalk.cyan(`  cd ${answers.projectName}`));
        console.log(chalk.cyan(`  ${answers.packageManager} run dev`));
        console.log("\nHappy coding! 🚀\n");
      } else {
        console.log(
          "\n" +
            chalk.yellow(
              "Project created but dependencies installation failed."
            )
        );
        console.log("\nTry installing dependencies manually:");
        console.log(chalk.cyan(`  cd ${answers.projectName}`));
        console.log(chalk.cyan(`  ${answers.packageManager} install`));
      }
    } catch (error) {
      spinner.fail("Failed to create project");
      if (error instanceof Error) {
        console.error(chalk.red("\nError details:"), error.message);
      }
      process.exit(1);
    }
  });

program.parse();
