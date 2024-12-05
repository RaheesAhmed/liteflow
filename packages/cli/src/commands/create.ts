import { resolve, join, dirname } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { logger } from "../utils/logger";
import { copyTemplate } from "../utils/template";
import { installDependencies } from "../utils/dependencies";

interface CreateAppOptions {
  name: string;
  template: string;
  typescript: boolean;
  packageManager: "npm" | "yarn" | "pnpm";
  root: string;
  templateDir: string;
}

export async function createApp(options: CreateAppOptions): Promise<void> {
  const { name, template, typescript, packageManager, root, templateDir } =
    options;

  if (!name) {
    throw new Error("Project name is required");
  }

  const projectPath = resolve(root, name);
  if (existsSync(projectPath)) {
    throw new Error(`Directory ${name} already exists`);
  }

  logger.info(`Creating a new LiteFlow app in ${projectPath}...`);

  try {
    // Create project directory
    mkdirSync(projectPath, { recursive: true });

    // Copy template files
    await copyTemplate(template, projectPath, templateDir, {
      projectName: name,
      typescript,
    });

    // Create additional directories
    const dirs = [
      "src/components",
      "src/pages",
      "src/hooks",
      "src/utils",
      "src/styles",
      "src/types",
      "src/api",
      "tests/unit",
      "tests/integration",
      "tests/e2e",
    ];

    dirs.forEach((dir) => {
      mkdirSync(join(projectPath, dir), { recursive: true });
    });

    // Create test setup files
    const testFiles = {
      "jest.config.js": `
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.test.(ts|tsx|js|jsx)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
};`,
      "tests/setup.js": `
require('@testing-library/jest-dom');
const { server } = require('./mocks/server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
      "tests/mocks/server.ts": `
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);`,
      "tests/mocks/handlers.ts": `
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/test', (req, res, ctx) => {
    return res(ctx.json({ message: 'Test API response' }));
  }),
];`,
    };

    Object.entries(testFiles).forEach(([file, content]) => {
      const filePath = join(projectPath, file);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, content.trim());
    });

    // Install dependencies
    logger.info("Installing dependencies...");
    await installDependencies(projectPath, packageManager, {
      dependencies: [
        "@liteflow/core",
        "react",
        "react-dom",
        "tailwindcss",
        "@headlessui/react",
        "@heroicons/react",
      ],
      devDependencies: [
        typescript ? "typescript" : null,
        "@types/react",
        "@types/react-dom",
        "@types/node",
        "jest",
        "@testing-library/react",
        "@testing-library/jest-dom",
        "@testing-library/user-event",
        "msw",
        typescript ? "ts-jest" : null,
        "postcss",
        "autoprefixer",
        "eslint",
        "prettier",
      ].filter((dep): dep is string => dep !== null),
    });

    // Initialize git repository
    try {
      execSync("git init", { cwd: projectPath });
      execSync("git add .", { cwd: projectPath });
      execSync('git commit -m "Initial commit"', { cwd: projectPath });
    } catch (error) {
      logger.info("Failed to initialize git repository");
    }

    // Success message
    logger.success(`
Successfully created ${name}!

Next steps:
  $ cd ${name}
  $ ${packageManager} dev     # Start development server
  $ ${packageManager} test    # Run tests
  $ ${packageManager} build   # Build for production
  $ ${packageManager} deploy  # Deploy your app

Documentation: https://liteflow.dev
GitHub: https://github.com/liteflow/liteflow
`);
  } catch (error) {
    logger.error("Failed to create project:", error);
    throw error;
  }
}
