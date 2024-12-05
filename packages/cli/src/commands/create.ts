import { create as createVite } from "create-vite";
import prompts from "prompts";
import ora from "ora";
import pc from "picocolors";
import path from "path";
import fs from "fs/promises";
import { copyTemplate, listTemplates } from "../utils/template";

interface CreateOptions {
  template?: string;
}

export async function create(name?: string, options?: CreateOptions) {
  // Get project name if not provided
  if (!name) {
    const response = await prompts({
      type: "text",
      name: "name",
      message: "What is your project named?",
      initial: "my-liteflow-app",
    });
    name = response.name;
  }

  if (!name) {
    console.log(pc.red("Project name is required"));
    process.exit(1);
  }

  // Get template choice
  const templates = await listTemplates();
  let templateName = options?.template || "default";

  if (!options?.template) {
    const response = await prompts({
      type: "select",
      name: "template",
      message: "Select a template",
      choices: templates.map((t) => ({
        title: t.name,
        description: t.description,
        value: t.name,
      })),
    });
    templateName = response.template;
  }

  const spinner = ora("Creating LiteFlow project...").start();

  try {
    // Create Vite project first
    await createVite(name, {
      template: "react-ts",
      framework: "react",
    });

    // Path to the created project
    const projectPath = path.resolve(process.cwd(), name);

    // Update package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

    // Add LiteFlow dependencies
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "@liteflow/ui": "^0.1.0",
      "@liteflow/core": "^0.1.0",
    };

    // Add LiteFlow scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview",
      "test:perf":
        "lighthouse http://localhost:5173 --output-path=./lighthouse-report.html --view",
    };

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Copy template files
    await copyTemplate(templateName, projectPath, {
      projectName: name,
    });

    spinner.succeed(pc.green(`Successfully created project ${pc.bold(name)}`));

    console.log("\nNext steps:");
    console.log(pc.cyan(`  cd ${name}`));
    console.log(pc.cyan("  npm install"));
    console.log(pc.cyan("  npm run dev"));
  } catch (error) {
    spinner.fail(pc.red("Failed to create project"));
    console.error(error);
    process.exit(1);
  }
}
