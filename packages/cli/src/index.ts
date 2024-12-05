#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

interface CreateOptions {
  name: string;
}

interface DevServerOptions {
  port: string;
}

const program = new Command();

program
  .name("liteflow")
  .description("CLI for LiteFlow framework")
  .version("0.1.0");

// Create new project
program
  .command("create")
  .description("Create a new LiteFlow project")
  .argument("[name]", "Project name")
  .action(async (name?: string) => {
    // Get project name if not provided
    if (!name) {
      const response = await inquirer.prompt<CreateOptions>([
        {
          type: "input",
          name: "name",
          message: "What is your project name?",
          default: "my-liteflow-app",
        },
      ]);
      name = response.name;
    }

    const spinner = ora("Creating LiteFlow project...").start();

    try {
      // Create project directory
      const projectDir = path.resolve(process.cwd(), name);
      await fs.ensureDir(projectDir);

      // Copy template files
      const templateDir = path.resolve(__dirname, "../templates/default");
      await fs.copy(templateDir, projectDir);

      // Update package.json
      const packageJson = await fs.readJson(
        path.join(projectDir, "package.json")
      );
      packageJson.name = name;
      await fs.writeJson(path.join(projectDir, "package.json"), packageJson, {
        spaces: 2,
      });

      spinner.succeed(chalk.green("Project created successfully!"));
      console.log("\nNext steps:");
      console.log(chalk.cyan(`  cd ${name}`));
      console.log(chalk.cyan("  npm install"));
      console.log(chalk.cyan("  npm run dev"));
    } catch (error) {
      spinner.fail(chalk.red("Failed to create project"));
      console.error(error);
      process.exit(1);
    }
  });

// Generate component
program
  .command("generate")
  .alias("g")
  .description("Generate LiteFlow resources")
  .argument("<type>", "Resource type (component, page, api)")
  .argument("<name>", "Resource name")
  .action(async (type: string, name: string) => {
    const spinner = ora(`Generating ${type}...`).start();

    try {
      const templatePath = path.resolve(__dirname, `../templates/${type}.ts`);
      const targetDir = path.resolve(process.cwd(), "src", type + "s");
      const targetPath = path.join(targetDir, `${name}.ts`);

      await fs.ensureDir(targetDir);
      await fs.copy(templatePath, targetPath);

      // Replace placeholders
      let content = await fs.readFile(targetPath, "utf-8");
      content = content.replace(/\$NAME/g, name);
      await fs.writeFile(targetPath, content);

      spinner.succeed(chalk.green(`${type} generated successfully!`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to generate ${type}`));
      console.error(error);
      process.exit(1);
    }
  });

// Dev server
program
  .command("dev")
  .description("Start development server")
  .option("-p, --port <port>", "Port number", "3000")
  .action(async (options: DevServerOptions) => {
    const spinner = ora("Starting development server...").start();

    try {
      // Use Vite API directly
      const { createServer } = await import("vite");
      const server = await createServer({
        configFile: path.resolve(process.cwd(), "vite.config.ts"),
        server: {
          port: parseInt(options.port),
        },
      });

      await server.listen();
      spinner.succeed(chalk.green("Development server started!"));
      console.log(chalk.cyan(`\nLocal: http://localhost:${options.port}`));
    } catch (error) {
      spinner.fail(chalk.red("Failed to start development server"));
      console.error(error);
      process.exit(1);
    }
  });

// Build
program
  .command("build")
  .description("Build for production")
  .action(async () => {
    const spinner = ora("Building for production...").start();

    try {
      // Use Vite API directly
      const { build } = await import("vite");
      await build({
        configFile: path.resolve(process.cwd(), "vite.config.ts"),
      });

      spinner.succeed(chalk.green("Build completed successfully!"));
    } catch (error) {
      spinner.fail(chalk.red("Build failed"));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
