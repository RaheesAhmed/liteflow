# Quick Start Guide

## Creating Your First LiteFlow App

1. **Create a New Project**

```bash
npx create-liteflow-app my-first-app
cd my-first-app
```

2. **Project Structure**

```
my-first-app/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── _components/
├── public/
├── styles/
└── package.json
```

3. **Start Development Server**

```bash
npm run dev
```

4. **Add a Simple Counter**

```typescript
// app/page.tsx
import { useLiteState } from "@liteflow/core";

export default function HomePage() {
  const [count, setCount] = useLiteState("counter", 0);

  return (
    <div>
      <h1>Welcome to LiteFlow!</h1>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
```

5. **Add Authentication**

```bash
lite add auth
```

```typescript
// app/login/page.tsx
import { useLiteAuth } from "@liteflow/auth";

export default function LoginPage() {
  const { login } = useLiteAuth();

  return <button onClick={() => login("google")}>Login with Google</button>;
}
```

6. **Add Database**

```bash
lite add db
```

```typescript
// app/api/users/route.ts
import { db } from "@liteflow/db";

export async function GET() {
  const users = await db.users.findMany();
  return { users };
}
```

## Next Steps

- Explore the full documentation
- Join our Discord community
- Try building a larger application
- Contribute to LiteFlow
