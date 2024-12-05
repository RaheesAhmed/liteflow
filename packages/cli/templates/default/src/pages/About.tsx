import React from "react";
import { useNavigate } from "@liteflow/core";

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            About LiteFlow
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A modern, lightweight web framework designed for developer
            productivity.
          </p>
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Key Features
            </h2>
            <ul className="mt-4 space-y-2 text-gray-500">
              <li>Zero configuration</li>
              <li>Type-safe by default</li>
              <li>Built-in routing</li>
              <li>State management</li>
              <li>Data fetching</li>
            </ul>
          </div>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
