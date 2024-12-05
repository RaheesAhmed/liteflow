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
  .version("0.1.1")
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
      spinner.start("Installing dependencies...");
      const installCommand =
        answers.packageManager === "npm" ? "install" : "install";
      await execa(answers.packageManager, [installCommand], {
        cwd: projectDir,
        stdio: "ignore",
      });

      spinner.succeed("Dependencies installed successfully!");

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
    } catch (error) {
      spinner.fail("Failed to create project");
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parse();
