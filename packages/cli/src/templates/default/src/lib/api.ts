import { useApi, useApiMutation } from "@liteflow/core";
import { z } from "zod";

// Example schema
const TodoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

type Todo = z.infer<typeof TodoSchema>;

// Example API hooks
export function useTodos() {
  return useApi("/todos", z.array(TodoSchema));
}

export function useCreateTodo() {
  return useApiMutation<Todo, { title: string }>("/todos", TodoSchema);
}

export function useUpdateTodo() {
  return useApiMutation<Todo, Partial<Todo>>("/todos", TodoSchema);
}
