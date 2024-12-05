import { copy } from "fs-extra";
import { join } from "path";
import pc from "picocolors";

interface CreateAppOptions {
  name: string;
  template: string;
  root: string;
  templateDir: string;
}

export async function createApp({
  name,
  template,
  root,
  templateDir,
}: CreateAppOptions) {
  const targetDir = join(root, name);
  const templatePath = join(templateDir, template);

  console.log(`\nCreating a new LiteFlow app in ${pc.cyan(targetDir)}...\n`);

  try {
    // Copy template files
    await copy(templatePath, targetDir);

    // Success message
    console.log(
      `${pc.green("Success!")} Created ${pc.cyan(name)} at ${pc.cyan(
        targetDir
      )}\n`
    );
    console.log("Inside that directory, you can run several commands:\n");
    console.log(pc.cyan("  npm run dev"));
    console.log("    Starts the development server.\n");
    console.log(pc.cyan("  npm run build"));
    console.log("    Builds the app for production.\n");
    console.log(pc.cyan("  npm start"));
    console.log("    Runs the built app in production mode.\n");
    console.log("We suggest that you begin by typing:\n");
    console.log(pc.cyan(`  cd ${name}`));
    console.log(pc.cyan("  npm install"));
    console.log(pc.cyan("  npm run dev\n"));
    console.log("Happy hacking! 🚀\n");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
