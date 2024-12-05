import path from "path";
import fs from "fs/promises";
import pc from "picocolors";

interface TemplateConfig {
  name: string;
  description: string;
  files: string[];
}

export async function getTemplateConfig(
  templateName: string
): Promise<TemplateConfig> {
  const templatePath = path.join(__dirname, "..", "templates", templateName);
  const configPath = path.join(templatePath, "template.json");

  try {
    const configContent = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configContent);
  } catch (error) {
    throw new Error(`Template ${pc.yellow(templateName)} not found`);
  }
}

export async function copyTemplate(
  templateName: string,
  targetDir: string,
  variables: Record<string, string>
) {
  const config = await getTemplateConfig(templateName);
  const templateDir = path.join(__dirname, "..", "templates", templateName);

  // Create target directory if it doesn't exist
  await fs.mkdir(targetDir, { recursive: true });

  // Copy each file from template
  for (const file of config.files) {
    const sourcePath = path.join(templateDir, file);
    const targetPath = path.join(targetDir, file);

    try {
      // Create directory if it doesn't exist
      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      // Read template file
      let content = await fs.readFile(sourcePath, "utf-8");

      // Replace variables in content
      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(
          new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"),
          value
        );
      }

      // Write file with replaced variables
      await fs.writeFile(targetPath, content);
    } catch (error) {
      console.warn(pc.yellow(`Warning: Could not copy ${file}`));
    }
  }
}

export async function listTemplates(): Promise<TemplateConfig[]> {
  const templatesDir = path.join(__dirname, "..", "templates");
  const templates: TemplateConfig[] = [];

  try {
    const entries = await fs.readdir(templatesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const config = await getTemplateConfig(entry.name);
          templates.push(config);
        } catch (error) {
          // Skip invalid templates
        }
      }
    }
  } catch (error) {
    console.warn(pc.yellow("Warning: Could not list templates"));
  }

  return templates;
}
