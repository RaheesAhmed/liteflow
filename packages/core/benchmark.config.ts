export default {
  // Global benchmark settings
  settings: {
    iterations: 1000, // Number of iterations per test
    warmup: 10, // Number of warmup iterations
    gc: true, // Enable garbage collection between tests
  },

  // Component-specific settings
  components: {
    state: {
      iterations: 100000,
      tests: {
        'Basic Operations': {
          operations: 2, // get + set
        },
        'Subscription Management': {
          operations: 2, // add + remove
        },
        'Selector Performance': {
          operations: 1,
        },
      },
    },
    router: {
      iterations: 10000,
      tests: {
        'Route Matching': {
          operations: 2, // match + params extraction
        },
        'Middleware Chain': {
          operations: 3, // guard + middleware + render
        },
      },
    },
    render: {
      iterations: 10000,
      tests: {
        'Component Caching': {
          operations: 2, // cache + retrieve
        },
        'SSR Performance': {
          operations: 1,
        },
        Hydration: {
          operations: 1,
        },
      },
    },
    fetch: {
      iterations: 10000,
      tests: {
        'Cache Operations': {
          operations: 2, // cache + retrieve
        },
        'Request Pipeline': {
          operations: 3, // fetch + transform + cache
        },
      },
    },
  },

  // Thresholds for performance regression detection
  thresholds: {
    duration: {
      warning: 1, // Warning if operation takes more than 1ms
      error: 5, // Error if operation takes more than 5ms
    },
    memory: {
      warning: 1024, // Warning if operation uses more than 1KB
      error: 5120, // Error if operation uses more than 5KB
    },
    opsPerSecond: {
      warning: 10000, // Warning if less than 10K ops/sec
      error: 1000, // Error if less than 1K ops/sec
    },
  },

  // Output configuration
  output: {
    format: 'table', // table, json, or csv
    saveResults: true, // Save results to file
    compareWithBaseline: true, // Compare with previous results
    baselineFile: './benchmark-baseline.json',
  },
};
