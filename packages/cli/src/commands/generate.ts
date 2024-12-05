import { resolve } from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger";

type GeneratorType = "component" | "page" | "api" | "hook" | "store" | "test";

interface GenerateOptions {
  path?: string;
}

export async function generateCommand(
  type: GeneratorType,
  name: string,
  options: GenerateOptions = {}
) {
  // Validate project
  const cwd = process.cwd();
  const pkgPath = resolve(cwd, "package.json");

  if (!(await fs.pathExists(pkgPath))) {
    logger.error(
      "No package.json found. Are you in a LiteFlow project directory?"
    );
    process.exit(1);
  }

  // Determine project configuration
  const hasTypeScript = await fs.pathExists(resolve(cwd, "tsconfig.json"));
  const extension = hasTypeScript ? "tsx" : "jsx";

  // Start generation
  const spinner = logger.spinner(`Generating ${type}...`);

  try {
    const generator = getGenerator(type);
    const targetPath = getTargetPath(type, name, options.path, extension);

    // Create directory if it doesn't exist
    await fs.ensureDir(dirname(targetPath));

    // Generate the file
    const content = await generator(name, hasTypeScript);
    await fs.writeFile(targetPath, content);

    // Generate additional files if needed
    if (type === "component") {
      // Generate test file
      const testPath = targetPath.replace(
        `.${extension}`,
        `.test.${extension}`
      );
      const testContent = await generateTest(name, hasTypeScript);
      await fs.writeFile(testPath, testContent);

      // Generate styles file
      const stylePath = targetPath.replace(`.${extension}`, ".module.css");
      await fs.writeFile(stylePath, generateStyles(name));
    }

    spinner.stop(`${capitalize(type)} generated successfully`);
    logger.success(`Created ${type}:`);
    logger.info("  %s", targetPath);
  } catch (error) {
    spinner.stop();
    logger.error(`Failed to generate ${type}:`, error);
    process.exit(1);
  }
}

// Helper functions
function getTargetPath(
  type: GeneratorType,
  name: string,
  customPath: string | undefined,
  extension: string
): string {
  const cwd = process.cwd();
  const basePath = customPath ? resolve(cwd, customPath) : cwd;

  switch (type) {
    case "component":
      return resolve(
        basePath,
        "src/components",
        `${name}/${name}.${extension}`
      );
    case "page":
      return resolve(basePath, "src/pages", `${name}.${extension}`);
    case "api":
      return resolve(basePath, "src/api", `${name}.ts`);
    case "hook":
      return resolve(basePath, "src/hooks", `use${name}.ts`);
    case "store":
      return resolve(basePath, "src/stores", `${name}Store.ts`);
    case "test":
      return resolve(basePath, "src/tests", `${name}.test.ts`);
    default:
      throw new Error(`Unknown generator type: ${type}`);
  }
}

function getGenerator(type: GeneratorType) {
  switch (type) {
    case "component":
      return generateComponent;
    case "page":
      return generatePage;
    case "api":
      return generateApi;
    case "hook":
      return generateHook;
    case "store":
      return generateStore;
    case "test":
      return generateTest;
    default:
      throw new Error(`Unknown generator type: ${type}`);
  }
}

// Generators
async function generateComponent(name: string, isTS: boolean): Promise<string> {
  return `import { type FC } from 'react';
import styles from './${name}.module.css';

${
  isTS
    ? `interface ${name}Props {
  children?: React.ReactNode;
}`
    : ""
}

const ${name}${isTS ? ": FC<" + name + "Props>" : ""} = ({ children }) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
};

export default ${name};
`;
}

async function generatePage(name: string, isTS: boolean): Promise<string> {
  return `import { type FC } from 'react';

${
  isTS
    ? `interface ${name}PageProps {
  params: Record<string, string>;
}`
    : ""
}

const ${name}Page${
    isTS ? ": FC<" + name + "PageProps>" : ""
  } = ({ params }) => {
  return (
    <div>
      <h1>${name} Page</h1>
    </div>
  );
};

export default ${name}Page;
`;
}

async function generateApi(name: string, isTS: boolean): Promise<string> {
  return `${
    isTS
      ? `interface ${name}Response {
  // Define your response type
}

interface ${name}Request {
  // Define your request type
}`
      : ""
  }

export async function ${name}Handler(${
    isTS ? "req: " + name + "Request" : "req"
  }) {
  try {
    // Implement your API logic here
    return {
      status: 200,
      body: {
        message: 'Success',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        message: 'Error',
        error: error.message,
      },
    };
  }
}
`;
}

async function generateHook(name: string, isTS: boolean): Promise<string> {
  return `import { useState, useEffect } from 'react';

${
  isTS
    ? `interface Use${name}Options {
  // Define your hook options
}

interface Use${name}Result {
  // Define your hook result
}`
    : ""
}

export function use${name}(${
    isTS ? "options: Use" + name + "Options" : "options"
  })${isTS ? ": Use" + name + "Result" : ""} {
  // Implement your hook logic here
  return {
    // Return your hook result
  };
}
`;
}

async function generateStore(name: string, isTS: boolean): Promise<string> {
  return `import { create } from 'zustand';

${
  isTS
    ? `interface ${name}State {
  // Define your state type
}`
    : ""
}

export const use${name}Store = create${
    isTS ? "<" + name + "State>" : ""
  }((set) => ({
  // Implement your store logic here
}));
`;
}

async function generateTest(name: string, isTS: boolean): Promise<string> {
  return `import { render, screen } from '@testing-library/react';
import ${name} from './${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name} />);
    // Add your test assertions here
  });
});
`;
}

function generateStyles(name: string): string {
  return `.root {
  /* Add your styles here */
}
`;
}

// Utility functions
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function dirname(path: string): string {
  return path.split("/").slice(0, -1).join("/");
}
