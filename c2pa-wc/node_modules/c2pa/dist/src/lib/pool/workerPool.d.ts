/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
export interface WorkerPoolConfig {
    scriptSrc: string;
    maxWorkers: number;
}
interface WorkerPool {
    execute: (method: string, args: any[]) => Promise<any>;
    terminate: () => void;
}
/**
 * Create a configurable pool of workers capable of concurrent task execution
 *
 * @param {WorkerPoolConfig} config
 * @returns {WorkerPool}
 */
export declare function createWorkerPool(config: WorkerPoolConfig): WorkerPool;
export {};
//# sourceMappingURL=workerPool.d.ts.map