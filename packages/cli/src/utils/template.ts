import { resolve, join } from "path";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { logger } from "./logger";
import pc from "picocolors";

interface TemplateOptions {
  projectName: string;
  typescript: boolean;
}

interface TemplateFile {
  path: string;
  content: string;
}

export async function copyTemplate(
  templateName: string,
  targetPath: string,
  templatesDir: string,
  options: TemplateOptions
): Promise<void> {
  try {
    const templatePath = resolve(templatesDir, templateName);
    if (!existsSync(templatePath)) {
      throw new Error(`Template ${pc.yellow(templateName)} not found`);
    }

    const files = await getTemplateFiles(templatePath);
    await processTemplateFiles(files, targetPath, options);
  } catch (error) {
    logger.error("Failed to copy template:", error);
    throw error;
  }
}

async function getTemplateFiles(templatePath: string): Promise<TemplateFile[]> {
  const files: TemplateFile[] = [];

  function readDirRecursive(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = fullPath.slice(templatePath.length + 1);

      if (entry.isDirectory()) {
        readDirRecursive(fullPath);
      } else {
        const content = readFileSync(fullPath, "utf-8");
        files.push({ path: relativePath, content });
      }
    }
  }

  readDirRecursive(templatePath);
  return files;
}

async function processTemplateFiles(
  files: TemplateFile[],
  targetPath: string,
  options: TemplateOptions
): Promise<void> {
  try {
    for (const file of files) {
      const filePath = join(targetPath, file.path);
      const dir = resolve(filePath, "..");

      // Create directory if it doesn't exist
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      // Process file content
      let content = file.content;
      content = replaceTemplateVariables(content, options);

      // Handle TypeScript/JavaScript files
      if (options.typescript) {
        if (file.path.endsWith(".js")) {
          continue; // Skip JavaScript files in TypeScript mode
        }
      } else {
        if (file.path.endsWith(".ts") || file.path.endsWith(".tsx")) {
          continue; // Skip TypeScript files in JavaScript mode
        }
      }

      // Write file
      writeFileSync(filePath, content);
    }
  } catch (error) {
    logger.error("Failed to process template files:", error);
    throw error;
  }
}

function replaceTemplateVariables(
  content: string,
  options: TemplateOptions
): string {
  const variables: Record<string, string> = {
    PROJECT_NAME: options.projectName,
    TYPESCRIPT: options.typescript ? "true" : "false",
  };

  return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const value = variables[key.trim()];
    return value !== undefined ? value : `{{${key}}}`;
  });
}

export function validateTemplate(templatePath: string): boolean {
  try {
    // Check if template directory exists
    if (!existsSync(templatePath)) {
      return false;
    }

    // Check for required files
    const requiredFiles = ["package.json", "README.md"];
    for (const file of requiredFiles) {
      if (!existsSync(join(templatePath, file))) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function listTemplates(templatesDir: string): string[] {
  try {
    return readdirSync(templatesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (error) {
    logger.error("Failed to list templates:", error);
    return [];
  }
}
