import { ReactNode } from "react";
import { useAppStore } from "../stores/app";
import { Button } from "@liteflow/ui";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useAppStore();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="LiteFlow" className="w-8 h-8" />
            <h1 className="text-xl font-bold">{{ projectName }}</h1>
          </div>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === "dark" ? "🌞" : "🌙"}
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          Built with ❤️ using LiteFlow
        </div>
      </footer>
    </div>
  );
}
