import { createStore } from "@liteflow/core";

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useAppStore = createStore<AppState>(
  {
    theme: "light",
    toggleTheme: () => {
      useAppStore.setState((state) => ({
        theme: state.theme === "light" ? "dark" : "light",
      }));
    },
  },
  {
    name: "app-store",
    persist: true,
    devtools: true,
  }
);
