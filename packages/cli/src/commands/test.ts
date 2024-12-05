import { execSync } from "child_process";
import { resolve } from "path";
import { existsSync } from "fs";
import { logger } from "../utils/logger";

interface TestOptions {
  watch?: boolean;
  coverage?: boolean;
  updateSnapshots?: boolean;
  testPattern?: string;
  ci?: boolean;
  silent?: boolean;
}

export async function testCommand(options: TestOptions = {}): Promise<void> {
  try {
    const projectRoot = process.cwd();
    validateTestSetup(projectRoot);

    const command = buildTestCommand(options);
    logger.info("Running tests...");

    execSync(command, {
      cwd: projectRoot,
      stdio: options.silent ? "pipe" : "inherit",
      env: {
        ...process.env,
        CI: options.ci ? "true" : "false",
        NODE_ENV: "test",
      },
    });

    if (!options.silent) {
      logger.success("Tests completed successfully!");
    }
  } catch (error) {
    if (!options.silent) {
      logger.error(
        "Tests failed:",
        error instanceof Error ? error.message : String(error)
      );
    }
    process.exit(1);
  }
}

function validateTestSetup(projectRoot: string): void {
  const requiredFiles = ["jest.config.js", "tests/setup.js", "package.json"];

  for (const file of requiredFiles) {
    const filePath = resolve(projectRoot, file);
    if (!existsSync(filePath)) {
      throw new Error(
        `Missing required test file: ${file}. Please run 'liteflow create' to set up a new project with test configuration.`
      );
    }
  }

  try {
    const pkg = require(resolve(projectRoot, "package.json"));
    const hasJest = pkg.devDependencies?.jest || pkg.dependencies?.jest;
    const hasTestingLibrary =
      pkg.devDependencies?.["@testing-library/react"] ||
      pkg.dependencies?.["@testing-library/react"];

    if (!hasJest || !hasTestingLibrary) {
      throw new Error(
        "Missing required test dependencies. Please install jest and @testing-library/react."
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to validate test setup: " + error.message);
    }
    throw new Error("Failed to validate test setup: Unknown error");
  }
}

function buildTestCommand(options: TestOptions): string {
  const {
    watch = false,
    coverage = false,
    updateSnapshots = false,
    testPattern,
    ci = false,
  } = options;

  const args = ["jest"];

  if (watch && !ci) {
    args.push("--watch");
  }

  if (coverage) {
    args.push("--coverage");
  }

  if (updateSnapshots) {
    args.push("--updateSnapshot");
  }

  if (testPattern) {
    args.push(testPattern);
  }

  if (ci) {
    args.push("--ci", "--runInBand", "--colors");
  }

  return args.join(" ");
}

export function generateTestFile(
  componentName: string,
  testType: "component" | "hook" | "util" | "integration" | "e2e"
): string {
  const templates: Record<string, string> = {
    component: `
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${componentName} } from '../${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName} />);
    // Add your test assertions here
  });

  it('handles user interactions', async () => {
    render(<${componentName} />);
    // Add your interaction tests here
  });

  it('matches snapshot', () => {
    const { container } = render(<${componentName} />);
    expect(container).toMatchSnapshot();
  });
});`,

    hook: `
import { renderHook, act } from '@testing-library/react';
import { use${componentName} } from '../use${componentName}';

describe('use${componentName}', () => {
  it('returns the expected value', () => {
    const { result } = renderHook(() => use${componentName}());
    // Add your test assertions here
  });

  it('handles state updates', () => {
    const { result } = renderHook(() => use${componentName}());
    act(() => {
      // Perform state updates here
    });
    // Add your assertions here
  });
});`,

    util: `
import { ${componentName} } from '../${componentName}';

describe('${componentName}', () => {
  it('performs the expected operation', () => {
    // Add your test assertions here
  });

  it('handles edge cases', () => {
    // Add your edge case tests here
  });

  it('handles errors', () => {
    // Add your error handling tests here
  });
});`,

    integration: `
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${componentName} } from '../${componentName}';

describe('${componentName} Integration', () => {
  it('integrates with other components', async () => {
    render(<${componentName} />);
    // Add your integration test assertions here
  });

  it('handles data flow correctly', async () => {
    render(<${componentName} />);
    // Add your data flow tests here
  });
});`,

    e2e: `
import { test, expect } from '@playwright/test';

test.describe('${componentName} E2E', () => {
  test('completes the main user flow', async ({ page }) => {
    await page.goto('/');
    // Add your E2E test steps here
  });

  test('handles error scenarios', async ({ page }) => {
    await page.goto('/');
    // Add your error scenario tests here
  });
});`,
  };

  return templates[testType] || templates.component;
}

export function setupE2ETests(projectRoot: string): void {
  try {
    // Install Playwright
    execSync("npm install -D @playwright/test", {
      cwd: projectRoot,
      stdio: "inherit",
    });

    // Initialize Playwright config
    execSync("npx playwright install", {
      cwd: projectRoot,
      stdio: "inherit",
    });

    logger.success("E2E test environment set up successfully!");
  } catch (error) {
    logger.error(
      "Failed to set up E2E test environment:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}
