import type {TaskExecutor} from "./shared";
import {serial} from "./serial";

/**
 * Very basic task runner implementation
 * 
 * @todo Add more configuration here
 * 
 * @param tasks Tasks to be run
 */
export async function execute(tasks: TaskExecutor<any>): Promise<void> {
  const start = Date.now();

  await serial(
    () => console.log(`Starting task run!`),
    tasks,
    () => {
      const total = Date.now() - start;
      console.log(`Finished task run!`, `Run took: ${total}`);
    }
  );
};
