import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Home } from "./Home";
import { About } from "./About";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </RouterRoutes>
  );
}

// Home Page
function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Welcome to {{ projectName }}</h1>
      <p className="text-xl text-gray-600">
        Get started by editing{" "}
        <code className="font-mono bg-gray-100 p-1 rounded">
          src/routes/index.tsx
        </code>
      </p>
    </div>
  );
}

// About Page
function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="text-xl text-gray-600">
        This is a LiteFlow project, the world's fastest full-stack framework.
      </p>
    </div>
  );
}
