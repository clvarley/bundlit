import type {TaskFunction, TaskExecutor} from "./shared";

/**
 * Creates a executor that runs the given tasks in parallel
 * 
 * @param tasks Tasks to be executed
 * @return      Parallel task executor
 */
export function parallel(...tasks: TaskFunction[]): TaskExecutor<"parallel"> {
  return async function () {
    const awaiting: Promise<void>[] = [];

    for (const task of tasks) {
      const result = task();

      if (result instanceof Promise) awaiting.push(result);
    }

    await Promise.all(awaiting);
  };
};
