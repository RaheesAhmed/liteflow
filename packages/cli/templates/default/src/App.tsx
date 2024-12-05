import React from "react";
import { LiteRouter, type RouteConfig } from "@liteflow/core";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: About,
  },
];

export function App() {
  return <LiteRouter routes={routes} />;
}
