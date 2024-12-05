#!/usr/bin/env node
import { cac } from "cac";
import { resolve, dirname } from "path";
import { createApp } from "./create-app";

const cli = cac("create-liteflow-app");
const __dirname = dirname(require.main?.filename || "");

cli
  .command("[project-name]", "Create a new LiteFlow project")
  .option("--template <template>", "Template to use", { default: "fullstack" })
  .action(async (projectName: string, options: { template: string }) => {
    try {
      await createApp({
        name: projectName,
        template: options.template,
        root: process.cwd(),
        templateDir: resolve(__dirname, "../templates"),
      });
    } catch (error) {
      console.error("Failed to create app:", error);
      process.exit(1);
    }
  });

cli.help();
cli.parse();
