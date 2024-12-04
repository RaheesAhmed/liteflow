#!/usr/bin/env node
import { Command } from "commander";
import { create } from "./commands/create.js";
import pc from "picocolors";

const program = new Command();

program
  .name("liteflow")
  .description("LiteFlow - World's fastest full-stack framework")
  .version("0.1.0");

program
  .command("create")
  .description("Create a new LiteFlow project")
  .argument("[name]", "Project name")
  .option("-t, --template <template>", "Template to use", "default")
  .action(create);

program
  .command("dev")
  .description("Start development server")
  .action(() => {
    console.log(pc.green("Starting development server..."));
    // TODO: Implement dev server
  });

program
  .command("build")
  .description("Build for production")
  .action(() => {
    console.log(pc.green("Building for production..."));
    // TODO: Implement build
  });

program
  .command("deploy")
  .description("Deploy your application")
  .action(() => {
    console.log(pc.green("Deploying application..."));
    // TODO: Implement deployment
  });

program.parse();
