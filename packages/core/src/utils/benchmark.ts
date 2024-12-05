import { performance } from 'perf_hooks';

export type BenchmarkResult = {
  name: string;
  duration: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
  };
  operations?: number;
  opsPerSecond?: number;
};

export type BenchmarkOptions = {
  iterations?: number;
  warmup?: number;
  name?: string;
  operations?: number;
};

export class Benchmark {
  private results: BenchmarkResult[] = [];

  async measure(
    fn: () => Promise<void> | void,
    options: BenchmarkOptions = {}
  ): Promise<BenchmarkResult> {
    const {
      iterations = 1000,
      warmup = 10,
      name = 'unnamed',
      operations,
    } = options;

    // Warmup phase
    for (let i = 0; i < warmup; i++) {
      await fn();
    }

    // Clear garbage before measurement
    if (global.gc) {
      global.gc();
    }

    const startMemory = process.memoryUsage();
    const startTime = performance.now();

    // Measurement phase
    for (let i = 0; i < iterations; i++) {
      await fn();
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const duration = (endTime - startTime) / iterations;
    const result: BenchmarkResult = {
      name,
      duration,
      memory: {
        heapUsed: (endMemory.heapUsed - startMemory.heapUsed) / iterations,
        heapTotal: (endMemory.heapTotal - startMemory.heapTotal) / iterations,
      },
    };

    if (operations) {
      result.operations = operations;
      result.opsPerSecond = (operations / duration) * 1000;
    }

    this.results.push(result);
    return result;
  }

  async compareFunctions(
    fns: { [name: string]: () => Promise<void> | void },
    options: Omit<BenchmarkOptions, 'name'> = {}
  ): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];

    for (const [name, fn] of Object.entries(fns)) {
      const result = await this.measure(fn, { ...options, name });
      results.push(result);
    }

    return results;
  }

  formatResults(results: BenchmarkResult[] = this.results): string {
    let output = '\nBenchmark Results:\n';
    output += '=================\n\n';

    results.forEach(result => {
      output += `${result.name}:\n`;
      output += `-----------------\n`;
      output += `Duration: ${result.duration.toFixed(3)}ms\n`;
      output += `Memory Used: ${(result.memory.heapUsed / 1024).toFixed(
        2
      )}KB\n`;
      if (result.opsPerSecond) {
        output += `Operations/sec: ${result.opsPerSecond.toFixed(2)}\n`;
      }
      output += '\n';
    });

    return output;
  }

  clearResults(): void {
    this.results = [];
  }
}

// Create benchmark suites for different components
export function createStateBenchmark() {
  return {
    name: 'State Management',
    async run(benchmark: Benchmark) {
      // Test 1: Basic store operations
      const store = new Map();
      const iterations = 100000;

      await benchmark.measure(
        () => {
          store.set('key', 'value');
          store.get('key');
          store.delete('key');
        },
        {
          name: 'Basic Store Operations',
          iterations,
          operations: 3,
        }
      );

      // Test 2: Complex state updates
      const complexState = {
        users: new Map(),
        posts: new Map(),
        comments: new Map(),
      };

      await benchmark.measure(
        () => {
          // Simulate user update
          complexState.users.set('user1', { name: 'John', age: 30 });
          // Simulate post creation
          complexState.posts.set('post1', { title: 'Test', author: 'user1' });
          // Simulate comment addition
          complexState.comments.set('comment1', {
            text: 'Great!',
            post: 'post1',
          });

          // Read operations
          const user = complexState.users.get('user1');
          const post = complexState.posts.get('post1');
          const comment = complexState.comments.get('comment1');
        },
        {
          name: 'Complex State Updates',
          iterations: iterations / 10, // Fewer iterations for complex operations
          operations: 6,
        }
      );

      // Test 3: Subscription management
      const subscribers = new Set();
      const mockSubscriber = () => {};

      await benchmark.measure(
        () => {
          subscribers.add(mockSubscriber);
          subscribers.delete(mockSubscriber);
          subscribers.has(mockSubscriber);
        },
        {
          name: 'Subscription Management',
          iterations,
          operations: 3,
        }
      );

      // Test 4: Selector performance
      const state = {
        todos: new Array(1000).fill(null).map((_, i) => ({
          id: i,
          text: `Todo ${i}`,
          completed: Math.random() > 0.5,
        })),
      };

      const selectCompletedTodos = (state: any) =>
        state.todos.filter((todo: any) => todo.completed);

      await benchmark.measure(
        () => {
          const completedTodos = selectCompletedTodos(state);
        },
        {
          name: 'Selector Performance',
          iterations: iterations / 100, // Fewer iterations for heavy computation
          operations: 1,
        }
      );

      // Test 5: Batch updates
      const batchState = new Map();
      const updates = new Array(100).fill(null).map((_, i) => ({
        key: `key${i}`,
        value: `value${i}`,
      }));

      await benchmark.measure(
        () => {
          // Simulate batch update
          updates.forEach(update => {
            batchState.set(update.key, update.value);
          });
          // Read all values
          updates.forEach(update => {
            batchState.get(update.key);
          });
        },
        {
          name: 'Batch Updates',
          iterations: iterations / 1000, // Fewer iterations for batch operations
          operations: 200, // 100 writes + 100 reads
        }
      );
    },
  };
}

export function createRouterBenchmark() {
  return {
    name: 'Router',
    async run(benchmark: Benchmark) {
      // Test 1: Basic route matching
      const routes = new Map([
        ['/users', { component: {} }],
        ['/users/:id', { component: {} }],
        ['/users/:id/posts', { component: {} }],
        ['/users/:id/posts/:postId', { component: {} }],
      ]);

      const testPaths = [
        '/users',
        '/users/123',
        '/users/123/posts',
        '/users/123/posts/456',
      ];

      await benchmark.measure(
        () => {
          testPaths.forEach(path => {
            // Simple route matching
            const route = Array.from(routes.entries()).find(([pattern]) => {
              return pattern.split('/').length === path.split('/').length;
            });
          });
        },
        {
          name: 'Basic Route Matching',
          iterations: 10000,
          operations: testPaths.length,
        }
      );

      // Test 2: Parameter extraction
      const paramRoutes = new Map([
        ['/users/:id', { params: ['id'] }],
        ['/users/:userId/posts/:postId', { params: ['userId', 'postId'] }],
        [
          '/orgs/:orgId/teams/:teamId/members/:memberId',
          { params: ['orgId', 'teamId', 'memberId'] },
        ],
      ]);

      const testParamPaths = [
        '/users/123',
        '/users/456/posts/789',
        '/orgs/abc/teams/def/members/ghi',
      ];

      await benchmark.measure(
        () => {
          testParamPaths.forEach(path => {
            // Parameter extraction
            const pathParts = path.split('/');
            const route = Array.from(paramRoutes.entries()).find(
              ([pattern]) => {
                return pattern.split('/').length === pathParts.length;
              }
            );

            if (route) {
              const params: Record<string, string> = {};
              const patternParts = route[0].split('/');
              pathParts.forEach((part, index) => {
                if (patternParts[index].startsWith(':')) {
                  params[patternParts[index].slice(1)] = part;
                }
              });
            }
          });
        },
        {
          name: 'Parameter Extraction',
          iterations: 10000,
          operations: testParamPaths.length,
        }
      );

      // Test 3: Middleware chain
      type Middleware = (ctx: any) => Promise<void>;
      const middlewares: Middleware[] = [
        async ctx => {
          /* Auth check */
        },
        async ctx => {
          /* Params validation */
        },
        async ctx => {
          /* Data loading */
        },
        async ctx => {
          /* Permissions */
        },
        async ctx => {
          /* Logging */
        },
      ];

      await benchmark.measure(
        async () => {
          const ctx = {};
          for (const middleware of middlewares) {
            await middleware(ctx);
          }
        },
        {
          name: 'Middleware Chain',
          iterations: 1000,
          operations: middlewares.length,
        }
      );

      // Test 4: Nested routes
      const nestedRoutes = {
        path: '/',
        children: [
          {
            path: 'users',
            children: [
              {
                path: ':id',
                children: [
                  {
                    path: 'posts',
                    children: [
                      {
                        path: ':postId',
                        children: [
                          {
                            path: 'comments',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const testNestedPaths = [
        '/users/123/posts/456/comments',
        '/users/789/posts',
        '/users/abc',
      ];

      function matchNestedRoute(
        route: any,
        pathParts: string[],
        index = 0
      ): boolean {
        if (index === pathParts.length) return true;
        const part = pathParts[index];

        if (!route.children) return false;

        for (const child of route.children) {
          if (child.path.startsWith(':') || child.path === part) {
            if (matchNestedRoute(child, pathParts, index + 1)) {
              return true;
            }
          }
        }

        return false;
      }

      await benchmark.measure(
        () => {
          testNestedPaths.forEach(path => {
            const pathParts = path.split('/').filter(Boolean);
            matchNestedRoute(nestedRoutes, pathParts);
          });
        },
        {
          name: 'Nested Route Matching',
          iterations: 5000,
          operations: testNestedPaths.length,
        }
      );

      // Test 5: Route compilation
      const routePatterns = [
        '/static/path',
        '/users/:id',
        '/users/:userId/posts/:postId',
        '/orgs/:orgId/teams/:teamId/members/:memberId',
      ];

      function compileRoute(pattern: string) {
        const parts = pattern.split('/');
        const regexParts = parts.map(part => {
          if (part.startsWith(':')) {
            return '([^/]+)';
          }
          return part;
        });
        return new RegExp(`^${regexParts.join('/')}$`);
      }

      await benchmark.measure(
        () => {
          routePatterns.forEach(pattern => {
            const regex = compileRoute(pattern);
            regex.test('/users/123');
          });
        },
        {
          name: 'Route Compilation',
          iterations: 10000,
          operations: routePatterns.length * 2, // compile + test
        }
      );
    },
  };
}

export function createRenderBenchmark() {
  return {
    name: 'Rendering',
    async run(benchmark: Benchmark) {
      // Test 1: Component caching
      const componentCache = new Map();
      const componentKeys = new Array(100)
        .fill(null)
        .map((_, i) => `component-${i}`);
      const mockComponent = {
        html: '<div class="component"><h1>Title</h1><p>Content</p></div>',
        state: { count: 0, items: [], user: { name: 'John' } },
      };

      await benchmark.measure(
        () => {
          // Cache operations
          componentKeys.forEach(key => {
            componentCache.set(key, mockComponent);
            componentCache.get(key);
          });
        },
        {
          name: 'Component Caching',
          iterations: 1000,
          operations: componentKeys.length * 2, // set + get
        }
      );

      // Test 2: HTML generation
      const items = new Array(100).fill(null).map((_, i) => ({
        id: i,
        title: `Item ${i}`,
        description: `Description for item ${i}`,
      }));

      function generateHTML(items: any[]) {
        return `
          <div class="container">
            <header class="header">
              <h1>Item List</h1>
              <nav>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/about">About</a></li>
                </ul>
              </nav>
            </header>
            <main>
              <div class="items">
                ${items
                  .map(
                    item => `
                  <article class="item" data-id="${item.id}">
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <button onclick="handleClick(${item.id})">View Details</button>
                  </article>
                `
                  )
                  .join('')}
              </div>
            </main>
            <footer>
              <p>&copy; 2023 LiteFlow</p>
            </footer>
          </div>
        `;
      }

      await benchmark.measure(
        () => {
          const html = generateHTML(items);
        },
        {
          name: 'HTML Generation',
          iterations: 1000,
          operations: items.length,
        }
      );

      // Test 3: State hydration
      const mockState = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
        posts: new Array(50).fill(null).map((_, i) => ({
          id: i,
          title: `Post ${i}`,
          content: `Content for post ${i}`,
          comments: new Array(5).fill(null).map((_, j) => ({
            id: j,
            text: `Comment ${j}`,
          })),
        })),
        ui: {
          sidebar: true,
          modal: null,
          loading: false,
          errors: {},
        },
      };

      function hydrateState(state: any) {
        const serialized = JSON.stringify(state);
        const hydrated = JSON.parse(serialized);
        return hydrated;
      }

      await benchmark.measure(
        () => {
          const hydrated = hydrateState(mockState);
        },
        {
          name: 'State Hydration',
          iterations: 1000,
          operations: 1,
        }
      );

      // Test 4: Component tree rendering
      type VNode = {
        type: string;
        props: Record<string, any>;
        children: (VNode | string)[];
      };

      function createVNode(
        type: string,
        props: Record<string, any> = {},
        ...children: (VNode | string)[]
      ): VNode {
        return { type, props, children };
      }

      function renderToString(vnode: VNode): string {
        const { type, props, children } = vnode;
        const propsString = Object.entries(props)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');

        const childrenString = children
          .map(child =>
            typeof child === 'string' ? child : renderToString(child)
          )
          .join('');

        return `<${type}${
          propsString ? ' ' + propsString : ''
        }>${childrenString}</${type}>`;
      }

      const complexComponent = createVNode(
        'div',
        { class: 'app' },
        createVNode(
          'header',
          { class: 'header' },
          createVNode('h1', {}, 'Title'),
          createVNode(
            'nav',
            {},
            createVNode(
              'ul',
              {},
              createVNode('li', {}, 'Home'),
              createVNode('li', {}, 'About'),
              createVNode('li', {}, 'Contact')
            )
          )
        ),
        createVNode(
          'main',
          { class: 'content' },
          createVNode(
            'section',
            { class: 'posts' },
            ...new Array(10)
              .fill(null)
              .map((_, i) =>
                createVNode(
                  'article',
                  { class: 'post', 'data-id': i },
                  createVNode('h2', {}, `Post ${i}`),
                  createVNode('p', {}, `Content ${i}`),
                  createVNode(
                    'div',
                    { class: 'actions' },
                    createVNode('button', { class: 'like' }, 'Like'),
                    createVNode('button', { class: 'share' }, 'Share')
                  )
                )
              )
          )
        ),
        createVNode(
          'footer',
          { class: 'footer' },
          createVNode('p', {}, '© 2023')
        )
      );

      await benchmark.measure(
        () => {
          const html = renderToString(complexComponent);
        },
        {
          name: 'Component Tree Rendering',
          iterations: 1000,
          operations: 1,
        }
      );

      // Test 5: Dynamic component updates
      const components = new Map<string, { props: any; state: any }>();
      const componentIds = new Array(100)
        .fill(null)
        .map((_, i) => `component-${i}`);

      componentIds.forEach(id => {
        components.set(id, {
          props: { title: `Component ${id}` },
          state: { count: 0 },
        });
      });

      function updateComponent(id: string, newProps: any) {
        const component = components.get(id);
        if (component) {
          component.props = { ...component.props, ...newProps };
          // Simulate state update based on props
          component.state.count += 1;
        }
      }

      await benchmark.measure(
        () => {
          componentIds.forEach(id => {
            updateComponent(id, { updated: true, timestamp: Date.now() });
          });
        },
        {
          name: 'Dynamic Updates',
          iterations: 1000,
          operations: componentIds.length,
        }
      );
    },
  };
}

export function createFetchBenchmark() {
  return {
    name: 'Data Fetching',
    async run(benchmark: Benchmark) {
      // Test 1: Cache operations
      const cache = new Map();
      const cacheKeys = new Array(100).fill(null).map((_, i) => `key-${i}`);
      const mockData = {
        id: 1,
        title: 'Test Data',
        content: 'Lorem ipsum dolor sit amet',
        timestamp: Date.now(),
      };

      await benchmark.measure(
        () => {
          cacheKeys.forEach(key => {
            cache.set(key, mockData);
            cache.get(key);
            cache.has(key);
          });
        },
        {
          name: 'Cache Operations',
          iterations: 1000,
          operations: cacheKeys.length * 3, // set + get + has
        }
      );

      // Test 2: Request deduplication
      const pendingRequests = new Map<string, Promise<any>>();
      const requestUrls = new Array(50)
        .fill(null)
        .map((_, i) => `/api/data/${i}`);

      function dedupRequest(url: string): Promise<any> {
        if (!pendingRequests.has(url)) {
          const promise = new Promise(resolve => {
            setTimeout(() => resolve({ data: `Response for ${url}` }), 1);
          });
          pendingRequests.set(url, promise);
          promise.finally(() => pendingRequests.delete(url));
        }
        return pendingRequests.get(url)!;
      }

      await benchmark.measure(
        async () => {
          await Promise.all(requestUrls.map(url => dedupRequest(url)));
        },
        {
          name: 'Request Deduplication',
          iterations: 100,
          operations: requestUrls.length,
        }
      );

      // Test 3: Response transformation
      type ApiResponse = {
        data: {
          id: number;
          attributes: {
            title: string;
            content: string;
            metadata: Record<string, any>;
          };
          relationships: {
            author: { id: number; type: string };
            comments: Array<{ id: number; type: string }>;
          };
        }[];
      };

      const mockResponses: ApiResponse[] = new Array(20)
        .fill(null)
        .map((_, i) => ({
          data: new Array(5).fill(null).map((_, j) => ({
            id: i * 5 + j,
            attributes: {
              title: `Post ${i * 5 + j}`,
              content: `Content for post ${i * 5 + j}`,
              metadata: {
                created: Date.now(),
                updated: Date.now(),
                tags: ['test', 'benchmark'],
              },
            },
            relationships: {
              author: { id: 1, type: 'user' },
              comments: new Array(3).fill(null).map((_, k) => ({
                id: k,
                type: 'comment',
              })),
            },
          })),
        }));

      function transformResponse(response: ApiResponse) {
        return response.data.map(item => ({
          id: item.id,
          title: item.attributes.title,
          content: item.attributes.content,
          metadata: item.attributes.metadata,
          author: item.relationships.author.id,
          commentCount: item.relationships.comments.length,
        }));
      }

      await benchmark.measure(
        () => {
          mockResponses.forEach(response => {
            const transformed = transformResponse(response);
          });
        },
        {
          name: 'Response Transformation',
          iterations: 1000,
          operations: mockResponses.length,
        }
      );

      // Test 4: Batch request handling
      type BatchRequest = {
        id: string;
        url: string;
        method: string;
        body?: any;
      };

      const batchRequests: BatchRequest[] = new Array(50)
        .fill(null)
        .map((_, i) => ({
          id: `req-${i}`,
          url: `/api/data/${i}`,
          method: i % 2 === 0 ? 'GET' : 'POST',
          body: i % 2 === 0 ? undefined : { data: `test ${i}` },
        }));

      async function processBatchRequest(requests: BatchRequest[]) {
        // Group requests by method
        const groups = new Map<string, BatchRequest[]>();
        requests.forEach(req => {
          if (!groups.has(req.method)) {
            groups.set(req.method, []);
          }
          groups.get(req.method)!.push(req);
        });

        // Process each group
        const results = new Map<string, any>();
        for (const [method, groupRequests] of groups) {
          // Simulate batch processing
          groupRequests.forEach(req => {
            results.set(req.id, {
              success: true,
              data: `Response for ${req.id}`,
            });
          });
        }

        return results;
      }

      await benchmark.measure(
        async () => {
          await processBatchRequest(batchRequests);
        },
        {
          name: 'Batch Request Handling',
          iterations: 100,
          operations: batchRequests.length,
        }
      );

      // Test 5: Error handling and retry logic
      type RequestConfig = {
        url: string;
        retries: number;
        backoff: number;
      };

      const requests: RequestConfig[] = new Array(20)
        .fill(null)
        .map((_, i) => ({
          url: `/api/data/${i}`,
          retries: 3,
          backoff: 100,
        }));

      async function fetchWithRetry(config: RequestConfig): Promise<any> {
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= config.retries; attempt++) {
          try {
            // Simulate request
            if (Math.random() > 0.7) {
              throw new Error('Random failure');
            }
            return { success: true };
          } catch (error) {
            lastError = error as Error;
            if (attempt < config.retries) {
              await new Promise(resolve =>
                setTimeout(resolve, config.backoff * Math.pow(2, attempt))
              );
            }
          }
        }

        throw lastError;
      }

      await benchmark.measure(
        async () => {
          await Promise.allSettled(requests.map(req => fetchWithRetry(req)));
        },
        {
          name: 'Error Handling and Retry',
          iterations: 10,
          operations: requests.length,
        }
      );
    },
  };
}
