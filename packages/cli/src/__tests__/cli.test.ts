import { execSync } from "child_process";
import { resolve } from "path";
import {
  existsSync,
  mkdirSync,
  rmdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { createApp } from "../commands/create";
import { testCommand } from "../commands/test";
import { installDependencies } from "../utils/dependencies";
import { copyTemplate } from "../utils/template";

const TEST_DIR = resolve(__dirname, "../../../test-projects");
const TEMPLATE_DIR = resolve(__dirname, "../../templates");

describe("CLI", () => {
  beforeAll(() => {
    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterAll(() => {
    if (existsSync(TEST_DIR)) {
      rmdirSync(TEST_DIR, { recursive: true });
    }
  });

  describe("Project Creation", () => {
    const projectName = "test-app";
    const projectPath = resolve(TEST_DIR, projectName);

    afterEach(() => {
      if (existsSync(projectPath)) {
        rmdirSync(projectPath, { recursive: true });
      }
    });

    it("should create a new project with TypeScript", async () => {
      await createApp({
        name: projectName,
        template: "fullstack",
        typescript: true,
        packageManager: "npm",
        root: TEST_DIR,
        templateDir: TEMPLATE_DIR,
      });

      expect(existsSync(projectPath)).toBe(true);
      expect(existsSync(resolve(projectPath, "tsconfig.json"))).toBe(true);
      expect(existsSync(resolve(projectPath, "package.json"))).toBe(true);
    });

    it("should create a new project with JavaScript", async () => {
      await createApp({
        name: projectName,
        template: "fullstack",
        typescript: false,
        packageManager: "npm",
        root: TEST_DIR,
        templateDir: TEMPLATE_DIR,
      });

      expect(existsSync(projectPath)).toBe(true);
      expect(existsSync(resolve(projectPath, "jsconfig.json"))).toBe(true);
      expect(existsSync(resolve(projectPath, "package.json"))).toBe(true);
    });

    it("should fail if project directory already exists", async () => {
      mkdirSync(projectPath, { recursive: true });

      await expect(
        createApp({
          name: projectName,
          template: "fullstack",
          typescript: true,
          packageManager: "npm",
          root: TEST_DIR,
          templateDir: TEMPLATE_DIR,
        })
      ).rejects.toThrow("Directory test-app already exists");
    });
  });

  describe("Template Management", () => {
    const templatePath = resolve(TEST_DIR, "test-template");
    const targetPath = resolve(TEST_DIR, "test-output");

    beforeEach(() => {
      mkdirSync(templatePath, { recursive: true });
      mkdirSync(resolve(templatePath, "src"), { recursive: true });
    });

    afterEach(() => {
      if (existsSync(templatePath)) {
        rmdirSync(templatePath, { recursive: true });
      }
      if (existsSync(targetPath)) {
        rmdirSync(targetPath, { recursive: true });
      }
    });

    it("should copy template files correctly", async () => {
      // Create test template files
      writeFileSync(
        resolve(templatePath, "package.json"),
        JSON.stringify({
          name: "{{PROJECT_NAME}}",
          version: "1.0.0",
        })
      );

      writeFileSync(
        resolve(templatePath, "src/index.ts"),
        'console.log("Hello {{PROJECT_NAME}}");'
      );

      await copyTemplate("test-template", targetPath, TEST_DIR, {
        projectName: "test-project",
        typescript: true,
      });

      const pkg = JSON.parse(
        readFileSync(resolve(targetPath, "package.json"), "utf-8")
      );
      expect(pkg.name).toBe("test-project");

      const index = readFileSync(resolve(targetPath, "src/index.ts"), "utf-8");
      expect(index).toContain("Hello test-project");
    });

    it("should handle TypeScript/JavaScript file selection", async () => {
      writeFileSync(resolve(templatePath, "src/index.ts"), "TypeScript");
      writeFileSync(resolve(templatePath, "src/index.js"), "JavaScript");

      // Test TypeScript mode
      await copyTemplate("test-template", targetPath, TEST_DIR, {
        projectName: "test-project",
        typescript: true,
      });

      expect(existsSync(resolve(targetPath, "src/index.ts"))).toBe(true);
      expect(existsSync(resolve(targetPath, "src/index.js"))).toBe(false);

      // Clean up and test JavaScript mode
      rmdirSync(targetPath, { recursive: true });
      await copyTemplate("test-template", targetPath, TEST_DIR, {
        projectName: "test-project",
        typescript: false,
      });

      expect(existsSync(resolve(targetPath, "src/index.ts"))).toBe(false);
      expect(existsSync(resolve(targetPath, "src/index.js"))).toBe(true);
    });
  });

  describe("Dependency Management", () => {
    const projectPath = resolve(TEST_DIR, "dep-test");

    beforeEach(() => {
      mkdirSync(projectPath, { recursive: true });
      writeFileSync(
        resolve(projectPath, "package.json"),
        JSON.stringify({
          name: "dep-test",
          version: "1.0.0",
        })
      );
    });

    afterEach(() => {
      if (existsSync(projectPath)) {
        rmdirSync(projectPath, { recursive: true });
      }
    });

    it("should install dependencies correctly", async () => {
      await installDependencies(projectPath, "npm", {
        dependencies: ["react"],
        devDependencies: ["typescript"],
      });

      const pkg = JSON.parse(
        readFileSync(resolve(projectPath, "package.json"), "utf-8")
      );

      expect(pkg.dependencies.react).toBeDefined();
      expect(pkg.devDependencies.typescript).toBeDefined();
    });

    it("should handle installation errors gracefully", async () => {
      await expect(
        installDependencies(projectPath, "npm", {
          dependencies: ["@invalid/package"],
        })
      ).rejects.toThrow();
    });
  });

  describe("Test Command", () => {
    const projectPath = resolve(TEST_DIR, "test-project");

    beforeEach(() => {
      mkdirSync(projectPath, { recursive: true });
      writeFileSync(
        resolve(projectPath, "package.json"),
        JSON.stringify({
          name: "test-project",
          version: "1.0.0",
          devDependencies: {
            jest: "^27.0.0",
            "@testing-library/react": "^12.0.0",
          },
        })
      );
      writeFileSync(
        resolve(projectPath, "jest.config.js"),
        "module.exports = {}"
      );
      mkdirSync(resolve(projectPath, "tests"), { recursive: true });
      writeFileSync(
        resolve(projectPath, "tests/setup.js"),
        "require('@testing-library/jest-dom');"
      );
    });

    afterEach(() => {
      if (existsSync(projectPath)) {
        rmdirSync(projectPath, { recursive: true });
      }
    });

    it("should validate test setup correctly", async () => {
      process.chdir(projectPath);
      await expect(testCommand()).resolves.not.toThrow();
    });

    it("should fail on missing test configuration", async () => {
      rmdirSync(resolve(projectPath, "tests"), { recursive: true });
      process.chdir(projectPath);
      await expect(testCommand()).rejects.toThrow();
    });
  });
});
