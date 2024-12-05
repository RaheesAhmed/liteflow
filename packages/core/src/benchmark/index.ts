import {
  Benchmark,
  createStateBenchmark,
  createRouterBenchmark,
  createRenderBenchmark,
  createFetchBenchmark,
  BenchmarkResult,
} from '../utils/benchmark';
import config from '../../benchmark.config';
import fs from 'fs/promises';
import path from 'path';

interface BenchmarkSuite {
  name: string;
  run: (benchmark: Benchmark) => Promise<void>;
}

async function saveResults(results: BenchmarkResult[]) {
  const { output } = config;
  if (!output.saveResults) return;

  const timestamp = new Date().toISOString();
  const resultsDir = path.join(__dirname, '../../benchmark-results');

  await fs.mkdir(resultsDir, { recursive: true });

  const filename = path.join(resultsDir, `benchmark-${timestamp}.json`);
  await fs.writeFile(filename, JSON.stringify(results, null, 2));

  if (output.compareWithBaseline) {
    try {
      const baseline = JSON.parse(
        await fs.readFile(output.baselineFile, 'utf-8')
      );
      compareWithBaseline(results, baseline);
    } catch (error) {
      console.warn('No baseline results found. Skipping comparison.');
    }
  }
}

function compareWithBaseline(
  current: BenchmarkResult[],
  baseline: BenchmarkResult[]
) {
  console.log('\nComparison with baseline:');
  console.log('========================\n');

  current.forEach(result => {
    const baselineResult = baseline.find(b => b.name === result.name);
    if (!baselineResult) return;

    const durationDiff =
      ((result.duration - baselineResult.duration) / baselineResult.duration) *
      100;
    const memoryDiff =
      ((result.memory.heapUsed - baselineResult.memory.heapUsed) /
        baselineResult.memory.heapUsed) *
      100;

    console.log(`${result.name}:`);
    console.log(
      `Duration: ${durationDiff > 0 ? '+' : ''}${durationDiff.toFixed(2)}%`
    );
    console.log(
      `Memory: ${memoryDiff > 0 ? '+' : ''}${memoryDiff.toFixed(2)}%\n`
    );
  });
}

function checkThresholds(result: BenchmarkResult) {
  const { thresholds } = config;
  const warnings: string[] = [];
  const errors: string[] = [];

  if (result.duration > thresholds.duration.error) {
    errors.push(
      `Duration exceeds error threshold: ${result.duration.toFixed(2)}ms`
    );
  } else if (result.duration > thresholds.duration.warning) {
    warnings.push(
      `Duration exceeds warning threshold: ${result.duration.toFixed(2)}ms`
    );
  }

  if (result.memory.heapUsed > thresholds.memory.error) {
    errors.push(
      `Memory usage exceeds error threshold: ${(
        result.memory.heapUsed / 1024
      ).toFixed(2)}KB`
    );
  } else if (result.memory.heapUsed > thresholds.memory.warning) {
    warnings.push(
      `Memory usage exceeds warning threshold: ${(
        result.memory.heapUsed / 1024
      ).toFixed(2)}KB`
    );
  }

  if (
    result.opsPerSecond &&
    result.opsPerSecond < thresholds.opsPerSecond.error
  ) {
    errors.push(
      `Operations per second below error threshold: ${result.opsPerSecond.toFixed(
        2
      )}`
    );
  } else if (
    result.opsPerSecond &&
    result.opsPerSecond < thresholds.opsPerSecond.warning
  ) {
    warnings.push(
      `Operations per second below warning threshold: ${result.opsPerSecond.toFixed(
        2
      )}`
    );
  }

  return { warnings, errors };
}

async function runBenchmarks() {
  console.log('Starting LiteFlow Performance Benchmarks...\n');

  const benchmark = new Benchmark();
  const suites: BenchmarkSuite[] = [
    createStateBenchmark(),
    createRouterBenchmark(),
    createRenderBenchmark(),
    createFetchBenchmark(),
  ];

  for (const suite of suites) {
    console.log(`Running ${suite.name} benchmarks...`);
    await suite.run(benchmark);
  }

  const results = benchmark.formatResults();
  console.log(results);

  // Check thresholds
  benchmark['results'].forEach(result => {
    const { warnings, errors } = checkThresholds(result);

    if (warnings.length > 0) {
      console.log(`\nWarnings for ${result.name}:`);
      warnings.forEach(w => console.log(`- ${w}`));
    }

    if (errors.length > 0) {
      console.log(`\nErrors for ${result.name}:`);
      errors.forEach(e => console.log(`- ${e}`));
    }
  });

  // Save results
  await saveResults(benchmark['results']);
}

// Run benchmarks if called directly
if (require.main === module) {
  runBenchmarks().catch(console.error);
}

export { runBenchmarks };
