import Link from "next/link";
import { ArrowRight, Zap, Lock, Palette, Database, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Lightning Fast",
    description:
      "5x faster builds than Next.js with instant HMR that actually works.",
    icon: Zap,
    href: "/docs/performance",
  },
  {
    title: "Type Safe",
    description:
      "End-to-end type safety with TypeScript, from API to database.",
    icon: Lock,
    href: "/docs/typescript",
  },
  {
    title: "Beautiful UI",
    description: "Built-in UI components based on shadcn/ui and Tailwind CSS.",
    icon: Palette,
    href: "/docs/ui",
  },
  {
    title: "Database Ready",
    description:
      "Integrated database with Prisma, migrations, and type safety.",
    icon: Database,
    href: "/docs/database",
  },
];

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Build faster with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LiteFlow
            </span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            The modern web framework for building fast, scalable applications.
            Zero vendor lock-in, built-in enterprise features, and
            developer-first experience.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/docs/getting-started">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs">Documentation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to build modern web applications. No
            configuration required.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <feature.icon className="h-12 w-12 text-primary" />
              <h3 className="font-heading mt-4 text-xl">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Get Started
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Start building with LiteFlow in minutes.
          </p>
          <div className="mt-4 w-full max-w-2xl rounded-lg bg-muted p-4">
            <pre className="text-sm text-muted-foreground">
              <code>npx create-liteflow-app my-app</code>
            </pre>
          </div>
          <Button asChild>
            <Link href="/docs/installation">
              Installation Guide <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
