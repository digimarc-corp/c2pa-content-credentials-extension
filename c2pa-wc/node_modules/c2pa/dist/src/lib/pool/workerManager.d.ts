/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { WorkerRequest } from './worker';
export interface WorkerManager {
    execute: (request: WorkerRequest) => Promise<unknown>;
    isWorking: () => boolean;
    terminate: () => void;
}
/**
 * Create a wrapper responsible for managing a single worker
 *
 * @param scriptUrl URL to worker script
 * @returns {WorkerManager}
 */
export declare function createWorkerManager(scriptUrl: string): WorkerManager;
//# sourceMappingURL=workerManager.d.ts.map