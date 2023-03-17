export type TaskFunction = () => any;
export type TaskExecutor<T extends "serial" | "parallel"> = () => Promise<void>;
