import type {TaskFunction, TaskExecutor} from "./shared";

/**
 * Creates a executor that runs the given tasks in sequence
 * 
 * @param tasks Tasks to be executed
 * @return      Serial task executor
 */
export function serial(...tasks: TaskFunction[]): TaskExecutor<"serial"> {
  return async function () {
    for (const task of tasks) {
      await task();
    }
  };
};
